/* eslint-disable class-methods-use-this */
import fs, { promises as fsP } from "fs";
import path from "path";
import simpleGit, { CheckRepoActions, SimpleGit } from "simple-git";
import { AdrRepository as IAdrRepository } from "@src/adr/application";
import {
  Adr,
  AdrFile,
  AdrSlug,
  Author,
  FilesystemPath,
  MarkdownBody,
  PackageRef
} from "@src/adr/domain";
import { Log4brainsConfig } from "@src/infrastructure/config";
import { Log4brainsError } from "@src/domain";
import { PackageRepository } from "./PackageRepository";
import { MarkdownAdrLinkResolver } from "../MarkdownAdrLinkResolver";

type DateAndAuthor = {
  date: Date;
  author: Author;
};

type Deps = {
  config: Log4brainsConfig;
  workdir: string;
  packageRepository: PackageRepository;
};

export class AdrRepository implements IAdrRepository {
  private readonly config: Log4brainsConfig;

  private readonly workdir: string;

  private readonly packageRepository: PackageRepository;

  private readonly git: SimpleGit;

  private gitAvailable?: boolean;

  private readonly markdownAdrLinkResolver: MarkdownAdrLinkResolver;

  constructor({ config, workdir, packageRepository }: Deps) {
    this.config = config;
    this.workdir = workdir;
    this.packageRepository = packageRepository;
    this.git = simpleGit({ baseDir: workdir });
    this.markdownAdrLinkResolver = new MarkdownAdrLinkResolver({
      adrRepository: this
    });
  }

  private async isGitAvailable(): Promise<boolean> {
    if (this.gitAvailable === undefined) {
      try {
        this.gitAvailable = await this.git.checkIsRepo();
      } catch (e) {
        this.gitAvailable = false;
      }
    }
    return this.gitAvailable;
  }

  async find(slug: AdrSlug): Promise<Adr> {
    const packageRef = this.getPackageRef(slug);
    const adr = await this.findInPath(
      slug,
      this.getAdrFolderPath(packageRef),
      packageRef
    );
    if (!adr) {
      throw new Log4brainsError("This ADR does not exist", slug.value);
    }
    return adr;
  }

  async findFromFile(adrFile: AdrFile): Promise<Adr | undefined> {
    const adrFolderPath = adrFile.path.join("..");
    const pkg = this.packageRepository.findByAdrFolderPath(adrFolderPath);
    const possibleSlug = AdrSlug.createFromFile(
      adrFile,
      pkg ? pkg.ref : undefined
    );

    try {
      return await this.find(possibleSlug);
    } catch (e) {
      // ignore
    }
    return undefined;
  }

  async findAll(): Promise<Adr[]> {
    const packages = this.packageRepository.findAll();
    return (
      await Promise.all([
        this.findAllInPath(this.getAdrFolderPath()),
        ...packages.map((pkg) => {
          return this.findAllInPath(pkg.adrFolderPath, pkg.ref);
        })
      ])
    )
      .flat()
      .sort(Adr.compare);
  }

  private async getCreationDateFromGit(
    file: AdrFile
  ): Promise<Date | undefined> {
    if (!(await this.isGitAvailable())) {
      return undefined;
    }
    const logs = (await this.git.log({ file: file.path.pathRelativeToCwd }))
      .all;
    if (!logs || logs.length === 0) {
      return undefined;
    }
    return new Date(logs[logs.length - 1].date);
  }

  private async getLastEditDateAndAuthorFromGit(
    file: AdrFile
  ): Promise<DateAndAuthor | undefined> {
    if (!(await this.isGitAvailable())) {
      return undefined;
    }
    const logs = (await this.git.log({ file: file.path.pathRelativeToCwd }))
      .all;
    if (!logs || logs.length === 0) {
      return undefined;
    }
    return {
      date: new Date(logs[0].date),
      author: new Author(logs[0].author_name, logs[0].author_email)
    };
  }

  private async getAuthorFromGitConfig(): Promise<Author> {
    if (await this.isGitAvailable()) {
      const config = await this.git.listConfig();
      if (config?.all["user.name"]) {
        return new Author(
          config.all["user.name"] as string,
          config.all["user.email"] as string | undefined
        );
      }
    }
    return Author.createAnonymous();
  }

  private async getLastEditDateFromFilesystem(file: AdrFile): Promise<Date> {
    const stat = await fsP.stat(file.path.absolutePath);
    return stat.mtime;
  }

  private async findInPath(
    slug: AdrSlug,
    p: FilesystemPath,
    packageRef?: PackageRef
  ): Promise<Adr | undefined> {
    return (
      await this.findAllInPath(p, packageRef, (f: AdrFile, s: AdrSlug) =>
        s.equals(slug)
      )
    ).pop();
  }

  private async findAllInPath(
    p: FilesystemPath,
    packageRef?: PackageRef,
    filter?: (f: AdrFile, s: AdrSlug) => boolean
  ): Promise<Adr[]> {
    const files = await fsP.readdir(p.absolutePath);
    return Promise.all(
      files
        .map((filename) => {
          return new FilesystemPath(
            p.cwdAbsolutePath,
            path.join(p.pathRelativeToCwd, filename)
          );
        })
        .filter((fsPath) => {
          return AdrFile.isPathValid(fsPath);
        })
        .map((fsPath) => {
          const adrFile = new AdrFile(fsPath);
          const slug = AdrSlug.createFromFile(adrFile, packageRef);
          return { adrFile, slug };
        })
        .filter(({ adrFile, slug }) => {
          if (filter) {
            return filter(adrFile, slug);
          }
          return true;
        })
        .map(({ adrFile, slug }) => {
          return fsP
            .readFile(adrFile.path.absolutePath, {
              encoding: "utf8"
            })
            .then(async (markdown) => {
              const creationGitDate = await this.getCreationDateFromGit(
                adrFile
              );
              const lastEditGit = await this.getLastEditDateAndAuthorFromGit(
                adrFile
              );
              return new Adr({
                slug,
                package: packageRef,
                body: new MarkdownBody(markdown).setAdrLinkResolver(
                  this.markdownAdrLinkResolver
                ),
                file: adrFile,
                creationDate:
                  creationGitDate ||
                  (await this.getLastEditDateFromFilesystem(adrFile)),
                lastEditDate:
                  lastEditGit?.date ||
                  (await this.getLastEditDateFromFilesystem(adrFile)),
                lastEditAuthor:
                  lastEditGit?.author || (await this.getAuthorFromGitConfig())
              });
            });
        })
    );
  }

  generateAvailableSlug(title: string, packageRef?: PackageRef): AdrSlug {
    const adrFolderPath = this.getAdrFolderPath(packageRef);
    const baseSlug = AdrSlug.createFromTitle(title, packageRef);

    let i = 1;
    let slug: AdrSlug;
    let filename: string;
    do {
      slug = new AdrSlug(`${baseSlug.value}${i > 1 ? `-${i}` : ""}`);
      filename = `${slug.namePart}.md`;
      i += 1;
    } while (fs.existsSync(path.join(adrFolderPath.absolutePath, filename)));

    return slug;
  }

  private getPackageRef(slug: AdrSlug): PackageRef | undefined {
    // undefined if global
    return slug.packagePart ? new PackageRef(slug.packagePart) : undefined;
  }

  private getAdrFolderPath(packageRef?: PackageRef): FilesystemPath {
    const pkg = packageRef
      ? this.packageRepository.find(packageRef)
      : undefined;
    const cwd = path.resolve(this.workdir);
    return pkg
      ? pkg.adrFolderPath
      : new FilesystemPath(cwd, this.config.project.adrFolder);
  }

  async save(adr: Adr): Promise<void> {
    let { file } = adr;
    if (!file) {
      file = AdrFile.createFromSlugInFolder(
        this.getAdrFolderPath(adr.package),
        adr.slug
      );
      if (fs.existsSync(file.path.absolutePath)) {
        throw new Log4brainsError(
          "An ADR with this slug already exists",
          adr.slug.value
        );
      }
      adr.setFile(file);
    }
    await fsP.writeFile(file.path.absolutePath, adr.body.getRawMarkdown(), {
      encoding: "utf-8"
    });
  }
}

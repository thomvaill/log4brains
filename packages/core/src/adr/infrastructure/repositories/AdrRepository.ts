/* eslint-disable class-methods-use-this */
import fs, { promises as fsP } from "fs";
import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
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

type DateAndAuthor = {
  date: Date;
  authorName: string;
  authorEmail: string;
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

  constructor({ config, workdir, packageRepository }: Deps) {
    this.config = config;
    this.workdir = workdir;
    this.packageRepository = packageRepository;
    this.git = simpleGit({ baseDir: workdir });
  }

  async find(slug: AdrSlug): Promise<Adr> {
    const packageRef = slug.packagePart
      ? new PackageRef(slug.packagePart)
      : undefined;
    const adr = (await this.findAllInPath(this.getAdrFolderPath(), packageRef))
      .filter((a) => a.slug.equals(slug))
      .pop();
    if (!adr) {
      throw new Log4brainsError("This ADR does not exist", slug.value);
    }
    return adr;
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
      .sort((a, b) => {
        // TODO: test
        if (
          a.publicationDateOrCreationDate &&
          !b.publicationDateOrCreationDate
        ) {
          return -1;
        }
        if (
          !a.publicationDateOrCreationDate &&
          b.publicationDateOrCreationDate
        ) {
          return 1;
        }
        if (
          a.publicationDateOrCreationDate! < b.publicationDateOrCreationDate!
        ) {
          return -1;
        }
        if (
          a.publicationDateOrCreationDate! > b.publicationDateOrCreationDate!
        ) {
          return 1;
        }
        if (a.slug.namePart < b.slug.namePart) {
          return -1;
        }
        if (a.slug.namePart > b.slug.namePart) {
          return 1;
        }
        return 0;
      });
  }

  private async getCreationDateFromGit(
    file: AdrFile
  ): Promise<Date | undefined> {
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
    const logs = (await this.git.log({ file: file.path.pathRelativeToCwd }))
      .all;
    if (!logs || logs.length === 0) {
      return undefined;
    }
    return {
      date: new Date(logs[0].date),
      authorName: logs[0].author_name,
      authorEmail: logs[0].author_email
    };
  }

  private async getCreationDateFromFilesystem(file: AdrFile): Promise<Date> {
    const stat = await fsP.stat(file.path.absolutePath);
    return stat.birthtime; // often fallback to mtime on many OSes. Not reliable
  }

  private async getLastEditDateFromFilesystem(file: AdrFile): Promise<Date> {
    const stat = await fsP.stat(file.path.absolutePath);
    return stat.mtime;
  }

  private async findAllInPath(
    p: FilesystemPath,
    packageRef?: PackageRef
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
          return fsP
            .readFile(fsPath.absolutePath, {
              encoding: "utf8"
            })
            .then(async (markdown) => {
              const adrFile = new AdrFile(fsPath);
              const creationGitDate = await this.getCreationDateFromGit(
                adrFile
              );
              const lastEditGit = await this.getLastEditDateAndAuthorFromGit(
                adrFile
              );
              return new Adr({
                slug: AdrSlug.createFromFile(adrFile, packageRef),
                package: packageRef,
                body: new MarkdownBody(markdown),
                file: adrFile,
                creationDate:
                  creationGitDate ||
                  (await this.getCreationDateFromFilesystem(adrFile)),
                lastEditDate: lastEditGit
                  ? lastEditGit.date
                  : await this.getLastEditDateFromFilesystem(adrFile),
                lastEditAuthor: lastEditGit
                  ? new Author(lastEditGit.authorName, lastEditGit.authorEmail)
                  : undefined
              });
            });
        })
    );
  }

  generateAvailableSlug(title: string, packageRef?: PackageRef): AdrSlug {
    const adrFolderPath = this.getAdrFolderPath(packageRef);

    const i = 1;
    let slug: AdrSlug;
    let filename: string;
    do {
      slug = AdrSlug.createFromTitle(title, packageRef);
      filename = `${slug.namePart}${i > 1 ? `-${i}` : ""}.md`;
    } while (fs.existsSync(path.join(adrFolderPath.absolutePath, filename)));

    return slug;
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
    if (!adr.file) {
      const file = AdrFile.createFromSlugInFolder(
        this.getAdrFolderPath(),
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
    await fsP.writeFile(
      adr.file!.path.absolutePath,
      adr.body.getRawMarkdown(),
      { encoding: "utf-8" }
    );
  }
}

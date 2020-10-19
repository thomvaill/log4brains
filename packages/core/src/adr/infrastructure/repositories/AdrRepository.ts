/* eslint-disable class-methods-use-this */
import fs from "fs";
import { promises as fsP } from "fs";
import path from "path";
import { AdrRepository as IAdrRepository } from "@src/adr/application";
import {
  Adr,
  AdrFile,
  AdrSlug,
  FilesystemPath,
  MarkdownBody,
  PackageRef
} from "@src/adr/domain";
import { Log4brainsConfig } from "@src/infrastructure/config";
import { Log4brainsError } from "@src/domain";
import { PackageRepository } from "./PackageRepository";

type Deps = {
  config: Log4brainsConfig;
  workdir: string;
  packageRepository: PackageRepository;
};

export class AdrRepository implements IAdrRepository {
  private readonly config: Log4brainsConfig;

  private readonly workdir: string;

  private readonly packageRepository: PackageRepository;

  constructor({ config, workdir, packageRepository }: Deps) {
    this.config = config;
    this.workdir = workdir;
    this.packageRepository = packageRepository;
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
          return this.findAllInPath(pkg.path, pkg.ref);
        })
      ])
    ).flat(); // TODO: order
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
            .then((markdown) => {
              const adrFile = new AdrFile(fsPath);
              return new Adr({
                slug: AdrSlug.createFromFile(adrFile, packageRef),
                package: packageRef,
                body: new MarkdownBody(markdown),
                file: adrFile
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

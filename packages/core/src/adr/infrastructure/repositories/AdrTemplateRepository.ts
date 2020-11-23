/* eslint-disable class-methods-use-this */
import fs, { promises as fsP } from "fs";
import path from "path";
import { AdrTemplateRepository as IAdrTemplateRepository } from "@src/adr/application";
import {
  AdrTemplate,
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

export class AdrTemplateRepository implements IAdrTemplateRepository {
  private readonly config: Log4brainsConfig;

  private readonly workdir: string;

  private readonly packageRepository: PackageRepository;

  constructor({ config, workdir, packageRepository }: Deps) {
    this.config = config;
    this.workdir = workdir;
    this.packageRepository = packageRepository;
  }

  async find(packageRef?: PackageRef): Promise<AdrTemplate> {
    const adrFolderPath = this.getAdrFolderPath(packageRef);
    const templatePath = path.join(adrFolderPath.absolutePath, "template.md");
    if (!fs.existsSync(templatePath)) {
      if (packageRef) {
        // Returns the global template when there is no custom template for a package
        const globalTemplate = await this.find();
        return new AdrTemplate({
          package: packageRef,
          body: globalTemplate.body
        });
      }
      throw new Log4brainsError(
        "The template.md file does not exist",
        adrFolderPath.pathRelativeToCwd
      );
    }

    const markdown = await fsP.readFile(templatePath, {
      encoding: "utf8"
    });
    return new AdrTemplate({
      package: packageRef,
      body: new MarkdownBody(markdown)
    });
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
}

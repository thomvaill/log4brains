import path from "path";
import fs from "fs";
import { FilesystemPath, Package, PackageRef } from "@src/adr/domain";
import { Log4brainsConfig } from "@src/infrastructure/config";
import { Log4brainsError } from "@src/domain";

type Deps = {
  config: Log4brainsConfig;
  workdir: string;
};

export class PackageRepository {
  private readonly config: Log4brainsConfig;

  private readonly workdir: string;

  constructor({ config, workdir }: Deps) {
    this.config = config;
    this.workdir = workdir;
  }

  find(packageRef: PackageRef): Package {
    const packageConfig = (this.config.project.packages || [])
      .filter((c) => c.name === packageRef.name)
      .pop();
    if (!packageConfig) {
      throw new Log4brainsError(
        "No entry in the configuration for this package",
        packageRef.name
      );
    }
    return this.buildPackage(
      packageConfig.name,
      packageConfig.path,
      packageConfig.adrFolder
    );
  }

  findAll(): Package[] {
    return (this.config.project.packages || []).map((packageConfig) =>
      this.buildPackage(
        packageConfig.name,
        packageConfig.path,
        packageConfig.adrFolder
      )
    );
  }

  private buildPackage(
    name: string,
    projectPath: string,
    adrFolder: string
  ): Package {
    const cwd = path.resolve(this.workdir);
    const pkg = new Package({
      ref: new PackageRef(name),
      path: new FilesystemPath(cwd, projectPath),
      adrFolderPath: new FilesystemPath(cwd, adrFolder)
    });

    if (!fs.existsSync(pkg.path.absolutePath)) {
      throw new Log4brainsError(
        "Package path does not exist",
        `${pkg.path.pathRelativeToCwd} (${pkg.ref.name})`
      );
    }

    if (!fs.existsSync(pkg.adrFolderPath.absolutePath)) {
      throw new Log4brainsError(
        "Package ADR folder path does not exist",
        `${pkg.adrFolderPath.pathRelativeToCwd} (${pkg.ref.name})`
      );
    }

    return pkg;
  }
}

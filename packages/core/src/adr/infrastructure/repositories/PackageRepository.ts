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

  // We cache findAll() results to avoid unnecessary I/O checks
  private packages?: Package[];

  constructor({ config, workdir }: Deps) {
    this.config = config;
    this.workdir = workdir;
  }

  find(packageRef: PackageRef): Package {
    const pkg = this.findAll()
      .filter((p) => p.ref.equals(packageRef))
      .pop();
    if (!pkg) {
      throw new Log4brainsError(
        "No entry in the configuration for this package",
        packageRef.name
      );
    }
    return pkg;
  }

  findByAdrFolderPath(adrFolderPath: FilesystemPath): Package | undefined {
    return this.findAll()
      .filter((p) => p.adrFolderPath.equals(adrFolderPath))
      .pop();
  }

  findAll(): Package[] {
    if (!this.packages) {
      this.packages = (
        this.config.project.packages || []
      ).map((packageConfig) =>
        this.buildPackage(
          packageConfig.name,
          packageConfig.path,
          packageConfig.adrFolder
        )
      );
    }
    return this.packages;
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

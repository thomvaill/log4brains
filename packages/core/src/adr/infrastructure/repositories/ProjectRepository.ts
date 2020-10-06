/* eslint-disable class-methods-use-this */
import path from "path";
import fs from "fs";
import { Project, FolderPath, FolderReference } from "@src/adr/domain";
import { Log4brainsConfig } from "@src/infrastructure/config";
import { Log4brainsError } from "@src/domain";

/**
 * This repository is only accessible from the infrastructure
 */
export class ProjectRepository {
  load(config: Log4brainsConfig, workdir = "."): Project {
    const project = new Project(config.project.name);

    config.adrFolders.forEach((folderConfig) => {
      const ref = folderConfig.name
        ? FolderReference.create(folderConfig.name)
        : FolderReference.createRoot();
      const folderPath = path.join(workdir, folderConfig.path);
      if (!fs.existsSync(folderPath)) {
        throw new Log4brainsError("This ADR folder does not exist", folderPath);
      }
      project.registerFolder(ref, new FolderPath(folderPath));
    });

    return project;
  }
}

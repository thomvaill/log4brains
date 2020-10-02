/* eslint-disable class-methods-use-this */
import path from "path";
import fs from "fs";
import { Result, ok, err } from "neverthrow";
import { Project } from "adr/domain/Project";
import { FolderPath, FolderReference } from "adr/domain/value-objects";
import { Log4brainsConfig } from "infrastructure/config";

// This repository is only accessible from the infrastructure
export class ProjectRepository {
  load(config: Log4brainsConfig, workdir = "."): Result<Project, Error> {
    const project = Project.create(config.project.name);
    // eslint-disable-next-line no-restricted-syntax
    for (const folderConfig of config.adrFolders) {
      const ref = folderConfig.name
        ? FolderReference.create(folderConfig.name)
        : FolderReference.createRoot();
      const folderPath = path.join(workdir, folderConfig.path);
      if (!fs.existsSync(folderPath)) {
        return err(new Error(`This directory does not exist: ${folderPath}`));
      }
      const res = project.registerFolder(ref, FolderPath.create(folderPath));
      if (res.isErr()) {
        return err(res.error);
      }
    }
    return ok(project);
  }
}

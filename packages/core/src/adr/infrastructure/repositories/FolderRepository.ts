/* eslint-disable class-methods-use-this */
import { RESOLVER } from "awilix";
import { promises as fsP } from "fs";
import path from "path";
import { FolderRepository as IFolderRepository } from "@src/adr/application";
import {
  Adr,
  Folder,
  FolderPath,
  FolderReference,
  MarkdownAdrFilename,
  MarkdownBody
} from "@src/adr/domain";

export class FolderRepository implements IFolderRepository {
  static [RESOLVER] = {}; // tells Awilix to automatically register this class

  async load(
    folderRef: FolderReference,
    folderPath: FolderPath
  ): Promise<Folder> {
    const files = await fsP.readdir(folderPath.value);
    const adrs = await Promise.all(
      files
        .filter(
          (filename) =>
            filename.toLowerCase() !== "template.md" &&
            filename.toLowerCase().endsWith(".md")
        )
        .map((filename) => {
          return fsP
            .readFile(path.join(folderPath.value, filename), {
              encoding: "utf8"
            })
            .then((markdown) => {
              return new Adr(
                folderRef,
                new MarkdownAdrFilename(filename),
                new MarkdownBody(markdown)
              );
            });
        })
    );

    return new Folder(folderRef, adrs);
  }
}

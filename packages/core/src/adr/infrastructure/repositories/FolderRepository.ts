/* eslint-disable class-methods-use-this */
import { Result, ok, err } from "neverthrow";
import { RESOLVER } from "awilix";
import { promises as fsP } from "fs";
import path from "path";
import { FolderRepository as IFolderRepository } from "adr/application";
import {
  AcceptableDomainError,
  DomainErrorSeverity,
  Adr,
  Folder,
  FolderPath,
  FolderReference,
  MarkdownAdrFilename,
  MarkdownBody
} from "adr/domain";

export class FolderRepository implements IFolderRepository {
  static [RESOLVER] = {}; // tells Awilix to automatically register this class

  async load(
    folderRef: FolderReference,
    folderPath: FolderPath
  ): Promise<Result<Folder, Error>> {
    try {
      const errors: AcceptableDomainError[] = [];
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
                const adrRes = Adr.create(
                  folderRef,
                  MarkdownAdrFilename.createUnsafe(filename),
                  MarkdownBody.create(markdown)
                );
                if (adrRes.isErr()) {
                  errors.push(
                    AcceptableDomainError.create(
                      adrRes.error,
                      DomainErrorSeverity.INFO
                    )
                  );
                  return undefined;
                }
                return adrRes.value;
              });
          })
      );

      return ok(
        Folder.create(
          folderRef,
          adrs.filter((adr) => adr !== undefined) as Adr[],
          errors
        )
      );
    } catch (e) {
      return err(e);
    }
  }
}

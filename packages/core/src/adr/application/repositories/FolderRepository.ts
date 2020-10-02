import { Result } from "neverthrow";
import { Folder, FolderReference, FolderPath } from "adr/domain";

export interface FolderRepository {
  load(
    folderRef: FolderReference,
    folderPath: FolderPath
  ): Promise<Result<Folder, Error>>;
}

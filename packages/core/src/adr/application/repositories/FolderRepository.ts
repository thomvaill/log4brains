import { Folder, FolderReference, FolderPath } from "@src/adr/domain";

export interface FolderRepository {
  load(folderRef: FolderReference, folderPath: FolderPath): Promise<Folder>;
}

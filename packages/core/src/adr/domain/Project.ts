import { Log4brainsError, ValueObjectMap } from "@src/domain";
import { FolderPath, FolderReference } from "./value-objects";

export class Project {
  readonly folderPaths: ValueObjectMap<
    FolderReference,
    FolderPath
  > = new ValueObjectMap<FolderReference, FolderPath>();

  constructor(readonly name: string) {}

  get folders(): FolderReference[] {
    return Array.from(this.folderPaths.keys());
  }

  isRootFolderRegistered(): boolean {
    return this.folderPaths.has(FolderReference.createRoot());
  }

  getFolderPath(ref: FolderReference): FolderPath | undefined {
    return this.folderPaths.get(ref);
  }

  registerFolder(ref: FolderReference, path: FolderPath): void {
    if (ref.root && this.isRootFolderRegistered()) {
      throw new Log4brainsError("Only one root folder is allowed");
    }
    if (this.folderPaths.has(ref)) {
      throw new Log4brainsError("This folder name already exists", ref.name);
    }
    this.folderPaths.set(ref, path);
  }
}

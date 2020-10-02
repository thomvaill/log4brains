import { Result, ok, err } from "neverthrow";
import { AggregateRoot } from "./AggregateRoot";
import { DomainError } from "./errors";
import { FolderPath, FolderReference, ValueObjectMap } from "./value-objects";

export class Project extends AggregateRoot {
  readonly folderPaths: ValueObjectMap<
    FolderReference,
    FolderPath
  > = new ValueObjectMap<FolderReference, FolderPath>();

  private constructor(readonly name: string) {
    super();
  }

  get folders(): FolderReference[] {
    return Array.from(this.folderPaths.keys());
  }

  isRootFolderRegistered(): boolean {
    return this.folderPaths.has(FolderReference.createRoot());
  }

  getFolderPath(ref: FolderReference): FolderPath | undefined {
    return this.folderPaths.get(ref);
  }

  registerFolder(
    ref: FolderReference,
    path: FolderPath
  ): Result<void, DomainError> {
    if (ref.root && this.isRootFolderRegistered()) {
      return err(new DomainError("Only one root folder is allowed"));
    }
    if (this.folderPaths.has(ref)) {
      return err(new DomainError("This path name already exists", ref.name));
    }
    this.folderPaths.set(ref, path);
    return ok(undefined);
  }

  static create(name: string): Project {
    return new Project(name);
  }
}

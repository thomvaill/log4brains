import { Folder, Project } from "adr/domain";
import { Result, err, ok } from "neverthrow";
import { FolderRepository } from "../repositories";

type Props = {
  adrProject: Project;
  folderRepository: FolderRepository;
};

export abstract class AdrUseCase {
  protected readonly project: Project;

  protected readonly folderRepository: FolderRepository;

  constructor({ adrProject, folderRepository }: Props) {
    this.project = adrProject;
    this.folderRepository = folderRepository;
  }

  protected async getFolders(): Promise<Result<Folder[], Error>> {
    const folderPaths = Array.from(this.project.folderPaths.entries());
    const foldersRes = await Promise.all(
      folderPaths.map(([ref, path]) => {
        return this.folderRepository.load(ref, path);
      })
    );
    const error = foldersRes.reduce<Error | undefined>(
      (prev, folderRes) => (folderRes.isErr() ? folderRes.error : undefined),
      undefined
    );
    if (error) {
      return err(error);
    }
    // eslint-disable-next-line no-underscore-dangle
    return ok(foldersRes.map((folderRes) => folderRes._unsafeUnwrap()));
  }
}

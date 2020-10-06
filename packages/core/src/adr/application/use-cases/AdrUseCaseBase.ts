import { Folder, Project } from "@src/adr/domain";
import { FolderRepository } from "../repositories";

type Props = {
  adrProject: Project;
  folderRepository: FolderRepository;
};

export abstract class AdrUseCaseBase {
  protected readonly project: Project;

  protected readonly folderRepository: FolderRepository;

  constructor({ adrProject, folderRepository }: Props) {
    this.project = adrProject;
    this.folderRepository = folderRepository;
  }

  protected getFolders(): Promise<Folder[]> {
    const folderPaths = Array.from(this.project.folderPaths.entries());
    return Promise.all(
      folderPaths.map(([ref, path]) => {
        return this.folderRepository.load(ref, path);
      })
    );
  }
}

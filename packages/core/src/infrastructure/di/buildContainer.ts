import {
  createContainer,
  asValue,
  InjectionMode,
  asClass,
  AwilixContainer,
  asFunction
} from "awilix";
import {
  FolderRepository as FolderRepositoryImpl,
  ProjectRepository
} from "adr/infrastructure/repositories";
import { FolderRepository, FindAllAdrsUseCase } from "adr/application";
import { Log4brainsConfig } from "infrastructure/config";
import { Project } from "adr/domain";

type BuildProjectProps = {
  projectRepository: ProjectRepository;
  config: Log4brainsConfig;
  workdir: string;
};
function buildProject({
  projectRepository,
  config,
  workdir
}: BuildProjectProps) {
  const projectRes = projectRepository.load(config, workdir);
  if (projectRes.isErr()) {
    throw projectRes.error;
  }
  return projectRes.value;
}

export interface ICradle {
  workdir: string;
  config: Log4brainsConfig;
  projectRepository: ProjectRepository;
  folderRepository: FolderRepository;
  adrProject: Project;
  findAllAdrsUseCase: FindAllAdrsUseCase;
}

export function buildContainer(
  config: Log4brainsConfig,
  workdir = "?"
): AwilixContainer<ICradle> {
  const container: AwilixContainer<ICradle> = createContainer<ICradle>({
    injectionMode: InjectionMode.PROXY
  });

  // Configuration
  container.register({
    workdir: asValue(workdir),
    config: asValue(config),
    adrProject: asFunction(buildProject).singleton()
  });

  // Repositories
  container.register({
    projectRepository: asClass(ProjectRepository).singleton(),
    folderRepository: asClass(FolderRepositoryImpl).singleton()
  });

  // Use cases
  container.register({
    findAllAdrsUseCase: asClass(FindAllAdrsUseCase).singleton()
  });

  return container;
}

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
} from "@src/adr/infrastructure/repositories";
import {
  FolderRepository,
  GetAllAdrsUseCase,
  GetAllDiagnosticsUseCase
} from "@src/adr/application";
import { Log4brainsConfig } from "@src/infrastructure/config";
import { Project } from "@src/adr/domain";

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
  return projectRepository.load(config, workdir);
}

export interface ICradle {
  workdir: string;
  config: Log4brainsConfig;
  projectRepository: ProjectRepository;
  folderRepository: FolderRepository;
  adrProject: Project;
  getAllAdrsUseCase: GetAllAdrsUseCase;
  getAllDiagnosticsUseCase: GetAllDiagnosticsUseCase;
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
    getAllAdrsUseCase: asClass(GetAllAdrsUseCase).singleton(),
    getAllDiagnosticsUseCase: asClass(GetAllDiagnosticsUseCase).singleton()
  });

  return container;
}

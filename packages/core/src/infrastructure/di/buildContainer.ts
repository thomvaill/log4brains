import {
  createContainer,
  asValue,
  InjectionMode,
  asClass,
  AwilixContainer
} from "awilix";
import { AdlRepository as AdlRepositoryImpl } from "adr/infrastructure/repositories";
import { FindAllAdrs } from "adr/application/use-cases";
import { AdlRepository } from "adr/application/repositories";
import { Log4brainsConfig } from "../../types";

export interface ICradle {
  adrDir: string;
  adlRepository: AdlRepository;
  findAllAdrs: FindAllAdrs;
}

export function buildContainer(
  config: Log4brainsConfig
): AwilixContainer<ICradle> {
  const container: AwilixContainer<ICradle> = createContainer<ICradle>({
    injectionMode: InjectionMode.PROXY
  });

  // Configuration
  container.register({
    adrDir: asValue(config.adrDir || "./docs/adr")
  });

  // Repositories
  container.register({
    adlRepository: asClass(AdlRepositoryImpl).singleton()
  });

  // Use cases
  container.register({
    findAllAdrs: asClass(FindAllAdrs).singleton()
  });

  return container;
}

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

export interface ICradle {
  adrDir: string;
  adlRepository: AdlRepository;
  findAllAdrs: FindAllAdrs;
}

export const container: AwilixContainer<ICradle> = createContainer<ICradle>({
  injectionMode: InjectionMode.PROXY
});

// Configuration
container.register({
  adrDir: asValue("./docs/adr") // TODO: make this configurable
});

// Repositories
container.register({
  adlRepository: asClass(AdlRepositoryImpl).singleton()
});

// Use cases
container.register({
  findAllAdrs: asClass(FindAllAdrs).singleton()
});

export function getContainer(): AwilixContainer<ICradle> {
  return container;
}

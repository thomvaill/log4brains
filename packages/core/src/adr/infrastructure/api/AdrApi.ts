import { FindAllAdrs } from "adr/application/use-cases/FindAllAdrs";
import { AwilixContainer } from "awilix";
import { buildContainer, ICradle } from "infrastructure/di";
import { Log4brainsConfig } from "types";
import { AdrDto } from "./types";

export interface AdrApi {
  findAll(): Promise<AdrDto[]>;
}

class AdrApiImpl implements AdrApi {
  container: AwilixContainer<ICradle>;

  constructor(config: Log4brainsConfig) {
    this.container = buildContainer(config);
  }

  async findAll(): Promise<AdrDto[]> {
    const useCase = this.container.resolve<FindAllAdrs>("findAllAdrs");
    const adrs = await useCase.execute();

    return adrs.map(
      (adr): AdrDto => {
        return {
          slug: adr.slug,
          number: adr.number,
          title: adr.title,
          body: { markdown: adr.markdown }
        };
      }
    );
  }
}

export function buildAdrApi(config: Log4brainsConfig): AdrApi {
  return new AdrApiImpl(config);
}

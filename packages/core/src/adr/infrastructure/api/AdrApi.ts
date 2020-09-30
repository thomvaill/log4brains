// TODO: fix these checks that are broken by Awilix!
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FindAllAdrs } from "adr/application/use-cases/FindAllAdrs";
import { AwilixContainer } from "awilix";
import { buildContainer, ICradle } from "infrastructure/di";
import { Log4brainsConfig } from "types";
import { Adr } from "./types";

export interface AdrApi {
  findAll(): Promise<Adr[]>;
}

class AdrApiImpl implements AdrApi {
  container: AwilixContainer<ICradle>;

  constructor(config: Log4brainsConfig) {
    this.container = buildContainer(config);
  }

  async findAll(): Promise<Adr[]> {
    const useCase = this.container.resolve<FindAllAdrs>("findAllAdrs");
    const adrs = await useCase.execute();

    return adrs.map(
      (adr): Adr => {
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

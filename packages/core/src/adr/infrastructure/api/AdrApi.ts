// TODO: fix these checks that are broken by Awilix!
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable class-methods-use-this */
import { FindAllAdrs } from "adr/application/use-cases/FindAllAdrs";
import { container } from "infrastructure/di";
import { Adr } from "./types";

export interface AdrApi {
  findAll(): Promise<Adr[]>;
}

class AdrApiImpl implements AdrApi {
  async findAll(): Promise<Adr[]> {
    const useCase = container.resolve<FindAllAdrs>("findAllAdrs");
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

export function buildAdrApi(): AdrApi {
  return new AdrApiImpl();
}

import { Adr } from "@src/adr/domain";
import { QueryHandler } from "@src/application";
import { Log4brainsError } from "@src/domain";
import { GetAdrBySlugQuery } from "../queries";
import { AdrRepository } from "../repositories";

type Deps = {
  adrRepository: AdrRepository;
};

export class GetAdrBySlugQueryHandler implements QueryHandler {
  readonly queryClass = GetAdrBySlugQuery;

  private readonly adrRepository: AdrRepository;

  constructor({ adrRepository }: Deps) {
    this.adrRepository = adrRepository;
  }

  async execute(query: GetAdrBySlugQuery): Promise<Adr | undefined> {
    try {
      return await this.adrRepository.find(query.slug);
    } catch (e) {
      if (
        !(e instanceof Log4brainsError && e.name === "This ADR does not exist")
      ) {
        throw e;
      }
    }
    return undefined;
  }
}

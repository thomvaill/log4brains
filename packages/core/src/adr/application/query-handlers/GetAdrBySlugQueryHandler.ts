import { Adr } from "@src/adr/domain";
import { QueryHandler } from "@src/application";
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

  execute(query: GetAdrBySlugQuery): Promise<Adr | undefined> {
    return this.adrRepository.find(query.slug);
  }
}

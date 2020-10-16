import { AdrSlug } from "@src/adr/domain";
import { QueryHandler } from "@src/application";
import { GenerateAdrSlugFromTitleQuery } from "../queries";
import { AdrRepository } from "../repositories";

type Deps = {
  adrRepository: AdrRepository;
};

export class GenerateAdrSlugFromTitleQueryHandler
  implements QueryHandler<GenerateAdrSlugFromTitleQuery> {
  readonly queryClass = GenerateAdrSlugFromTitleQuery;

  private readonly adrRepository: AdrRepository;

  constructor({ adrRepository }: Deps) {
    this.adrRepository = adrRepository;
  }

  execute(query: GenerateAdrSlugFromTitleQuery): Promise<AdrSlug> {
    return Promise.resolve(
      this.adrRepository.generateAvailableSlug(query.title, query.packageRef)
    );
  }
}

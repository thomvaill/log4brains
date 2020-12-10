import { AdrSlug } from "@src/adr/domain";
import { Query } from "@src/application";

export class GetAdrBySlugQuery extends Query {
  constructor(public readonly slug: AdrSlug) {
    super();
  }
}

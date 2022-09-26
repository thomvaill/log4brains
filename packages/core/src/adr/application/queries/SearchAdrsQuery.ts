import { AdrStatus } from "@src/adr/domain";
import { Query } from "@src/application";

export type SearchAdrsFilters = {
  statuses?: AdrStatus[];
  tags?: string[];
};

export class SearchAdrsQuery extends Query {
  constructor(public readonly filters: SearchAdrsFilters) {
    super();
  }
}

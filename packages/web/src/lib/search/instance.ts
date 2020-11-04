import { AdrDto } from "@log4brains/core";
import { Search } from "./Search";

export function createSearchInstance(adrs: AdrDto[]): Search {
  // TODO: generate the serialized index in public/ during the build and load the index from it when SSG
  return Search.createFromAdrs(adrs);
}

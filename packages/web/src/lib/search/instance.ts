import { Adr } from "../../types";
import { Search } from "./Search";

export function createSearchInstance(adrs: Adr[]): Search {
  // TODO: generate the serialized index in public/ during the build and load the index from it when SSG
  return Search.createFromAdrs(adrs);
}

import { Adr, AdrLight } from "../lib-shared/types";

export function buildAdrUrl(adr: AdrLight | Adr): string {
  return `/adr/${adr.slug}`;
}

import { Adr, AdrLight } from "../types";

export function buildAdrUrl(adr: AdrLight | Adr): string {
  return `/adr/${adr.slug}`;
}

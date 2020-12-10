import { Adr, AdrLight } from "../types";

export function getAdrBySlug(
  slug: string,
  adrs: AdrLight[]
): AdrLight | undefined {
  return adrs.filter((a) => a.slug === slug).pop();
}

export function buildAdrUrl(adr: AdrLight | Adr): string {
  return `/adr/${adr.slug}`;
}

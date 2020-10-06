import { Adr } from "@src/adr/domain";
import { AdrDto } from "../types";

export function adrToDto(adr: Adr): AdrDto {
  return {
    folder: adr.folder.root ? null : adr.folder.name || null,
    number: adr.number ? adr.number.value : null,
    slug: adr.slug.value,
    title: adr.title || null,
    body: {
      markdown: adr.body.getRawMarkdown()
    }
  };
}

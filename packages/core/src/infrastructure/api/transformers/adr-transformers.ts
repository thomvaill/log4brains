import { Adr } from "@src/adr/domain";
import { deepFreeze } from "@src/utils";
import { AdrDto, AdrDtoStatus } from "../types";

export function adrToDto(adr: Adr): AdrDto {
  if (!adr.file || !adr.creationDate) {
    throw new Error("You are serializing an non-saved ADR");
  }

  return deepFreeze<AdrDto>({
    slug: adr.slug.value,
    package: adr.package?.name || null,
    title: adr.title || null,
    status: adr.status.name as AdrDtoStatus,
    supersededBy: adr.superseder?.value || null,
    tags: adr.tags,
    body: { markdown: adr.body.getRawMarkdown() },
    creationDate: adr.creationDate.toJSON(),
    publicationDate: adr.publicationDate?.toJSON() || null,
    file: {
      relativePath: adr.file.path.pathRelativeToCwd,
      absolutePath: adr.file.path.absolutePath
    }
  });
}

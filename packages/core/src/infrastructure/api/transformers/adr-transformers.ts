import { Adr } from "@src/adr/domain";
import { deepFreeze } from "@src/utils";
import { AdrDto, AdrDtoStatus } from "../types";

export async function adrToDto(adr: Adr): Promise<AdrDto> {
  if (!adr.file) {
    throw new Error("You are serializing an non-saved ADR");
  }

  return deepFreeze<AdrDto>({
    slug: adr.slug.value,
    package: adr.package?.name || null,
    title: adr.title || null,
    status: adr.status.name as AdrDtoStatus,
    supersededBy: adr.superseder?.value || null,
    tags: adr.tags,
    deciders: adr.deciders,
    body: {
      rawMarkdown: adr.body.getRawMarkdown(),
      enhancedMdx: await adr.getEnhancedMdx()
    },
    creationDate: adr.creationDate.toJSON(),
    lastEditDate: adr.lastEditDate.toJSON(),
    lastEditAuthor: adr.lastEditAuthor.name,
    publicationDate: adr.publicationDate?.toJSON() || null,
    file: {
      relativePath: adr.file.path.pathRelativeToCwd,
      absolutePath: adr.file.path.absolutePath
    }
  });
}

import { Adr } from "@src/adr/domain";
import { deepFreeze } from "@src/utils";
import { AdrDto, AdrDtoStatus } from "../types";

export function adrToDto(adr: Adr): AdrDto {
  return deepFreeze<AdrDto>({
    slug: adr.slug.value,
    package: adr.package?.name || null,
    title: adr.title || null,
    status: adr.status.name as AdrDtoStatus,
    supersededBy: adr.superseder?.value || null,
    date: adr.date,
    tags: adr.tags,
    body: { markdown: adr.body.getRawMarkdown() },
    file: {
      relativePath: adr.file.path.pathRelativeToCwd,
      absolutePath: adr.file.path.absolutePath
    }
  });
}

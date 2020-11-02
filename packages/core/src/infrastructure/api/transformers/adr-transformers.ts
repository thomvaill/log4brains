import { Adr, AdrFile } from "@src/adr/domain";
import { GitRepositoryConfig } from "@src/infrastructure/config";
import { deepFreeze } from "@src/utils";
import { AdrDto, AdrDtoStatus } from "../types";

function buildViewUrl(
  repositoryConfig: GitRepositoryConfig,
  file: AdrFile
): string | undefined {
  if (!repositoryConfig.url || !repositoryConfig.viewFileUriPattern) {
    return undefined;
  }
  const uri = repositoryConfig.viewFileUriPattern
    .replace("%branch", "master") // TODO: make this customizable
    .replace("%path", file.path.pathRelativeToCwd);
  return `${repositoryConfig.url.replace(/\.git$/, "")}${uri}`;
}

export async function adrToDto(
  adr: Adr,
  repositoryConfig?: GitRepositoryConfig
): Promise<AdrDto> {
  if (!adr.file) {
    throw new Error("You are serializing an non-saved ADR");
  }

  const viewUrl = repositoryConfig
    ? buildViewUrl(repositoryConfig, adr.file)
    : undefined;

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
    },
    ...(repositoryConfig && repositoryConfig.provider && viewUrl
      ? {
          repository: {
            provider: repositoryConfig.provider,
            viewUrl
          }
        }
      : undefined)
  });
}

import {
  Adr,
  AdrFile,
  MarkdownAdrLink,
  MarkdownAdrLinkResolver as IMarkdownAdrLinkResolver
} from "@src/adr/domain";
import { Log4brainsError } from "@src/domain";
import { AdrRepository } from "./repositories";

type Deps = {
  adrRepository: AdrRepository;
};

export class MarkdownAdrLinkResolver implements IMarkdownAdrLinkResolver {
  private readonly adrRepository: AdrRepository;

  constructor({ adrRepository }: Deps) {
    this.adrRepository = adrRepository;
  }

  async resolve(from: Adr, uri: string): Promise<MarkdownAdrLink | undefined> {
    if (!from.file) {
      throw new Log4brainsError(
        "Impossible to resolve links on an non-saved ADR"
      );
    }

    const path = from.file.path.join("..").join(uri);
    if (!AdrFile.isPathValid(path)) {
      return undefined;
    }

    const to = await this.adrRepository.findFromFile(new AdrFile(path));
    if (!to) {
      return undefined;
    }

    return new MarkdownAdrLink(from, to);
  }
}

import { Adr } from "./Adr";
import { MarkdownAdrLink } from "./MarkdownAdrLink";

export interface MarkdownAdrLinkResolver {
  resolve(from: Adr, uri: string): Promise<MarkdownAdrLink | undefined>;
}

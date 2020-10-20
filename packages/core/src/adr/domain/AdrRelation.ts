import { ValueObject } from "@src/domain";
import { Adr } from "./Adr";
import { MarkdownAdrLink } from "./MarkdownAdrLink";

type Props = {
  from: Adr;
  relation: string;
  to: Adr;
};

export class AdrRelation extends ValueObject<Props> {
  constructor(from: Adr, relation: string, to: Adr) {
    super({ from, relation, to });
  }

  get from(): Adr {
    return this.props.from;
  }

  get relation(): string {
    return this.props.relation;
  }

  get to(): Adr {
    return this.props.to;
  }

  toMarkdown(): string {
    const link = new MarkdownAdrLink(this.from, this.to);
    return `${this.relation} ${link.toMarkdown()}`;
  }
}

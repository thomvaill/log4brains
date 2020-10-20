import { Log4brainsError, ValueObject } from "@src/domain";
import { Adr } from "./Adr";

type Props = {
  from: Adr;
  to: Adr;
};

export class MarkdownAdrLink extends ValueObject<Props> {
  constructor(from: Adr, to: Adr) {
    super({ from, to });
  }

  get from(): Adr {
    return this.props.from;
  }

  get to(): Adr {
    return this.props.to;
  }

  toMarkdown(): string {
    if (!this.from.file || !this.to.file) {
      throw new Log4brainsError(
        "Impossible to create a link between to unsaved ADRs",
        `${this.from.slug.value} -> ${this.to.slug.value}`
      );
    }
    const relativePath = this.from.file.path.relative(this.to.file.path);
    return `[${this.to.slug.value}](${relativePath})`;
  }
}

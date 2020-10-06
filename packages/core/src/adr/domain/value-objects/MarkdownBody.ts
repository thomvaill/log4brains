import cheerio from "cheerio";
import MarkdownIt from "markdown-it";
import { ValueObject } from "@src/domain";

const markdownItInstance = new MarkdownIt();

type Props = {
  value: string;
};

export class MarkdownBody extends ValueObject<Props> {
  private $: cheerio.Root; // read-only!

  constructor(value: string) {
    super({ value });
    this.$ = cheerio.load(markdownItInstance.render(value));
  }

  getFirstH1Title(): string | undefined {
    return this.$("h1").first().html() || undefined;
  }

  getRawMarkdown(): string {
    return this.props.value;
  }
}

import cheerio from "cheerio";
import MarkdownIt from "markdown-it";
import { ValueObject } from "./ValueObject";

const markdownItInstance = new MarkdownIt();

type Props = {
  value: string;
};

export class MarkdownBody extends ValueObject<Props> {
  private $: cheerio.Root; // read-only!

  private constructor(props: Props) {
    super(props);
    this.$ = cheerio.load(markdownItInstance.render(props.value));
  }

  getFirstH1Title(): string | undefined {
    return this.$("h1").first().html() || undefined;
  }

  getRawMarkdown(): string {
    return this.props.value;
  }

  static create(raw: string): MarkdownBody {
    return new MarkdownBody({ value: raw });
  }
}

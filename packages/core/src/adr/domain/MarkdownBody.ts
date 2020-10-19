/* eslint-disable @typescript-eslint/no-non-null-assertion */
import cheerio from "cheerio";
import MarkdownIt from "markdown-it";
import escapeStringRegexp from "escape-string-regexp";
import { Entity } from "@src/domain";

const markdownItInstance = new MarkdownIt();

type Props = {
  value: string;
};

export class MarkdownBody extends Entity<Props> {
  private $!: cheerio.Root; // read-only!

  constructor(value: string) {
    super({ value });
    this.parse();
  }

  private parse(): void {
    this.$ = cheerio.load(markdownItInstance.render(this.props.value));
  }

  getFirstH1Title(): string | undefined {
    return this.$("h1").first().html() || undefined;
  }

  setFirstH1Title(title: string): void {
    if (this.getFirstH1Title() === undefined) {
      this.props.value = `# ${title}\n${this.props.value}`;
    } else {
      const regexp = new RegExp(
        `^# ${escapeStringRegexp(this.getFirstH1Title()!)}`
      );
      this.props.value = this.props.value.replace(regexp, `# ${title}`);
    }
    this.parse();
  }

  getRawMarkdown(): string {
    return this.props.value;
  }

  clone(): MarkdownBody {
    return new MarkdownBody(this.props.value);
  }
}

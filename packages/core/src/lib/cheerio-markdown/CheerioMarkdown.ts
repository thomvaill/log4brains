import cheerio from "cheerio";
import MarkdownIt from "markdown-it";
import { markdownItSourceMap } from "./markdown-it-source-map-plugin";
import { CheerioMarkdownElement } from "./CheerioMarkdownElement";

// TODO: I am thinking to create a standalone library for this one

const markdownItInstance = new MarkdownIt();
markdownItInstance.use(markdownItSourceMap);

function isWindowsLine(line: string): boolean {
  return line.endsWith(`\r\n`) || line.endsWith(`\r`);
}

type OnChangeObserver = (markdown: string) => void;

export class CheerioMarkdown {
  public $!: cheerio.Root; // for read-only purposes only!

  private readonly observers: OnChangeObserver[] = [];

  constructor(private $markdown: string) {
    this.updateMarkdown($markdown);
  }

  get markdown(): string {
    return this.$markdown;
  }

  get nbLines(): number {
    return this.markdown.split(`\n`).length;
  }

  onChange(cb: OnChangeObserver): void {
    this.observers.push(cb);
  }

  private updateMarkdown(markdown: string): void {
    this.$markdown = markdown;
    this.$ = cheerio.load(markdownItInstance.render(this.markdown));
    this.observers.forEach((observer) => observer(this.markdown));
  }

  getLine(i: number): string {
    const lines = this.markdown.split(/\r?\n/);
    if (lines[i] === undefined) {
      throw new Error(`Unknown line ${i}`);
    }
    return lines[i];
  }

  replaceText(elt: cheerio.Cheerio, newText: string): void {
    const mdElt = new CheerioMarkdownElement(elt);
    if (mdElt.startLine === undefined || mdElt.endLine === undefined) {
      throw new Error("Cannot source-map this element from Markdown");
    }

    for (let i = mdElt.startLine; i < mdElt.endLine; i += 1) {
      const newLine = this.getLine(mdElt.startLine).replace(
        elt.text(),
        newText
      );
      this.replaceLine(mdElt.startLine, newLine);
    }
  }

  deleteElement(elt: cheerio.Cheerio): void {
    const mdElt = new CheerioMarkdownElement(elt);
    if (mdElt.startLine === undefined || mdElt.endLine === undefined) {
      throw new Error("Cannot source-map this element from Markdown");
    }
    this.deleteLines(mdElt.startLine, mdElt.endLine - 1);
  }

  replaceLine(i: number, newLine: string): void {
    const lines = this.markdown.split(`\n`);
    if (lines[i] === undefined) {
      throw new Error(`Unknown line ${i}`);
    }
    lines[i] = `${newLine}${isWindowsLine(lines[i]) ? `\r` : ""}`;
    this.updateMarkdown(lines.join(`\n`));
  }

  deleteLines(start: number, end?: number): void {
    const lines = this.markdown.split(`\n`);
    if (lines[start] === undefined) {
      throw new Error(`Unknown line ${start}`);
    }
    const length = end ? end - start + 1 : 1;
    lines.splice(start, length);
    this.updateMarkdown(lines.join(`\n`));
  }

  insertLineAt(i: number, newLine: string): void {
    const lines = this.markdown.split(`\n`);
    if (lines.length === 0) {
      lines.push(`\n`);
    }
    if (lines[i] === undefined) {
      throw new Error(`Unknown line ${i}`);
    }
    lines.splice(i, 0, `${newLine}${isWindowsLine(lines[i]) ? `\r` : ""}`);
    this.updateMarkdown(lines.join(`\n`));
  }

  insertLineAfter(elt: cheerio.Cheerio, newLine: string): void {
    const mdElt = new CheerioMarkdownElement(elt);
    if (mdElt.endLine === undefined) {
      throw new Error("Cannot source-map this element from Markdown");
    }
    const end = elt.is("ul") ? mdElt.endLine - 1 : mdElt.endLine;
    this.insertLineAt(end, newLine);
  }

  appendLine(newLine: string): void {
    const lines = this.markdown.split(`\n`);
    const windowsLines = lines.length > 0 ? isWindowsLine(lines[0]) : false;
    if (lines[lines.length - 1].trim() === "") {
      delete lines[lines.length - 1];
    }
    lines.push(`${newLine}${windowsLines ? `\r` : ""}`);
    lines.push(`${windowsLines ? `\r` : ""}\n`);
    this.updateMarkdown(lines.join(`\n`));
  }

  appendToList(ul: cheerio.Cheerio, newItem: string): void {
    if (!ul.is("ul")) {
      throw new TypeError("Given element is not a <ul>");
    }
    const mdElt = new CheerioMarkdownElement(ul);
    if (mdElt.markup === undefined || mdElt.level === undefined) {
      throw new Error("Cannot source-map this element from Markdown");
    }
    if (mdElt.level > 0) {
      throw new Error("Sub-lists are not implemented yet");
    }
    const newLine = `${mdElt.markup} ${newItem}`;
    this.insertLineAfter(ul, newLine);
  }
}

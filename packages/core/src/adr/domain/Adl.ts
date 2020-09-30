import { Adr } from "./Adr";
import {
  AdrNumberDuplicate,
  CantExtractAdrNumberFromFilename,
  Diagnostic,
  MissingH1Title
} from "./diagnostics";
import { extractAdrNumberFromFilename } from "./extractAdrNumberFromFilename";
import { mdQuery } from "./mdQuery";

export class Adl {
  readonly adrs: Adr[] = [];

  readonly diagnotics: Diagnostic[] = [];

  loadAdrFromMarkdownFile(filename: string, markdown: string): Adr | undefined {
    const $ = mdQuery(markdown);

    if (!filename.toLowerCase().endsWith(".md")) {
      throw new Error(
        "Only .md files can be passed to loadAdrFromMarkdownFile()"
      );
    }
    const slug = filename.replace(/\.md$/i, "");

    const number = extractAdrNumberFromFilename(filename);
    if (number === undefined) {
      if (filename.toLowerCase() !== "template.md")
        this.diagnotics.push(new CantExtractAdrNumberFromFilename(filename));
      return undefined;
    }

    if (this.getAdrsByNumber(number).length > 0) {
      this.diagnotics.push(new AdrNumberDuplicate(filename, number));
    }

    const title = $("h1").first().html();
    if (!title) {
      this.diagnotics.push(new MissingH1Title(filename));
    }
    const adr = new Adr(slug, number, markdown, title || undefined);
    this.adrs.push(adr);
    return adr;
  }

  getAdrsByNumber(number: number): Adr[] {
    return this.adrs.filter((adr) => {
      return adr.number === number;
    });
  }

  private getNextAvailableAdrNumber(): number {
    return this.adrs.length === 0 ? 0 : this.adrs.slice(-1)[0].number + 1;
  }
}

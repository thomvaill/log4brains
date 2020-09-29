import { Adr } from "./Adr";
import { Diagnostic, DiagnosticSeverity } from "./Diagnostic";
import { extractAdrNumberFromFilename } from "./extractAdrNumberFromFilename";
import { mdQuery } from "./mdQuery";

export class Adl {
  readonly adrs: Adr[] = [];

  readonly diagnotics: Diagnostic[] = [];

  loadAdrFromMarkdownFile(filename: string, markdown: string): Adr | undefined {
    const $ = mdQuery(markdown);

    const number = extractAdrNumberFromFilename(filename);
    if (number === undefined) {
      if (filename.toLowerCase() !== "template.md")
        this.diagnotics.push(
          new Diagnostic(
            DiagnosticSeverity.INFO,
            "This file was ignored because we cannot extract an ADR number from its name",
            filename
          )
        );
      return undefined;
    }

    if (this.getAdrsByNumber(number).length > 0) {
      this.diagnotics.push(
        new Diagnostic(
          DiagnosticSeverity.WARNING,
          `This ADR number already exists: ${number}`,
          filename
        )
      );
    }

    const title = $("h1").first().html();
    if (!title) {
      this.diagnotics.push(
        new Diagnostic(
          DiagnosticSeverity.WARNING,
          "This ADR has no H1 title",
          filename
        )
      );
    }
    const adr = new Adr(number, markdown, title || undefined);
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

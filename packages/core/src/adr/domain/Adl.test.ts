/* eslint-disable sonarjs/no-duplicate-string */
import { Adl } from "./Adl";
import {
  CantExtractAdrNumberFromFilename,
  AdrNumberDuplicate,
  MissingH1Title
} from "./diagnostics";

describe("Adl", () => {
  describe("loadAdrFromMarkdownFile()", () => {
    let adl: Adl;
    beforeEach(() => {
      adl = new Adl();
    });

    it("creates the ADR, add and returns it", () => {
      const adr = adl.loadAdrFromMarkdownFile("0001-My-ADR.md", "# Test");
      expect(adr).toBeDefined();
      expect(adl.adrs).toHaveLength(1);
      expect(adl.getAdrsByNumber(1)[0]).toEqual(adr);
    });

    it("builds the ADR slug correctly", () => {
      const adr = adl.loadAdrFromMarkdownFile("0001-My-ADR.md", "# Test");
      expect(adr).toBeDefined();
      expect((adr || {}).slug).toEqual("0001-My-ADR");
    });

    it("detects the ADR number from its filename", () => {
      const adr = adl.loadAdrFromMarkdownFile("0001-My-ADR.md", "# Test");
      expect(adr).toBeDefined();
      expect((adr || {}).number).toEqual(1);
    });

    it("ignores the file when it's impossible to detect the ADR number from its filename", () => {
      const adr = adl.loadAdrFromMarkdownFile("My-ADR.md", "# Test");
      expect(adr).toBeUndefined();
      expect(adl.adrs).toHaveLength(0);
      expect(adl.diagnotics).toContainEqual(
        new CantExtractAdrNumberFromFilename("My-ADR.md")
      );
    });

    it("handles ADR duplicates with a warning", () => {
      adl.loadAdrFromMarkdownFile("0001-My-ADR.md", "# Test");
      adl.loadAdrFromMarkdownFile("0001-My-ADR-duplicate.md", "# Test");
      expect(adl.adrs).toHaveLength(2);
      expect(adl.getAdrsByNumber(1)).toHaveLength(2);
      expect(adl.diagnotics).toContainEqual(
        new AdrNumberDuplicate("0001-My-ADR-duplicate.md", 1)
      );
    });

    it("triggers a warning when the H1 title is missing", () => {
      const adr = adl.loadAdrFromMarkdownFile(
        "0001-My-ADR.md",
        `hello
      ## Subtitle
      Paragraph
      `
      );
      expect(adr).toBeDefined();
      expect((adr || {}).title).toBeUndefined();
      expect(adl.diagnotics).toContainEqual(
        new MissingH1Title("0001-My-ADR.md")
      );
    });
  });
});

import { MarkdownAdrFilename } from "./MarkdownAdrFilename";

describe("MarkdownAdrFilename", () => {
  describe("allowed formats", () => {
    const checkFormatWorks = (format: string) => {
      const checkNumber = (number: number) => {
        const filenameStr = format
          .replace("%NNNN", number.toString().padStart(4, "0"))
          .replace("%N", number.toString());
        const filename = new MarkdownAdrFilename(filenameStr);
        const adrNumberRes = filename.extractAdrNumber();
        expect(adrNumberRes.isOk()).toBeTruthy();
        if (adrNumberRes.isOk()) {
          expect(adrNumberRes.value.value).toEqual(number);
        }
      };

      checkNumber(0);
      checkNumber(1);
      checkNumber(10);
      checkNumber(100);
      checkNumber(1000);
      checkNumber(4242);
    };

    const formatsThatShouldWork = [
      "%NNNN-lorem-ipsum.md",
      "%NNNN-lorem-ipsum.MD",
      "%NNNN_lorem-ipsum.md",
      "%NNNNlorem-ipsum.md",
      "%N-lorem-ipsum.md",
      "%N-lorem-ipsum.MD",
      "%N_lorem-ipsum.md",
      "%Nlorem-ipsum.md",

      "adr-%NNNN-lorem-ipsum.md",
      "adr-%NNNN-lorem-ipsum.MD",
      "adr_%NNNN_lorem-ipsum.md",
      "adr-%NNNNlorem-ipsum.md",
      "adr%NNNN-lorem-ipsum.md",
      "adr%NNNN_lorem-ipsum.md",
      "adr%NNNNlorem-ipsum.md",
      "adr-%N-lorem-ipsum.md",
      "adr-%N-lorem-ipsum.MD",
      "adr_%N_lorem-ipsum.md",
      "adr-%Nlorem-ipsum.md",
      "adr%N-lorem-ipsum.md",
      "adr%N_lorem-ipsum.md",
      "adr%Nlorem-ipsum.md",

      "ADR-%NNNN-lorem-ipsum.md",
      "ADR-%NNNN-lorem-ipsum.MD",
      "ADR_%NNNN_lorem-ipsum.md",
      "ADR-%NNNNlorem-ipsum.md",
      "ADR%NNNN-lorem-ipsum.md",
      "ADR%NNNN_lorem-ipsum.md",
      "ADR%NNNNlorem-ipsum.md",
      "ADR-%N-lorem-ipsum.md",
      "ADR-%N-lorem-ipsum.MD",
      "ADR_%N_lorem-ipsum.md",
      "ADR-%Nlorem-ipsum.md",
      "ADR%N-lorem-ipsum.md",
      "ADR%N_lorem-ipsum.md",
      "ADR%Nlorem-ipsum.md"
    ];

    formatsThatShouldWork.forEach((format) => {
      // eslint-disable-next-line jest/expect-expect
      it(`can extract the ADR number from this format: ${format}`, () => {
        checkFormatWorks(format);
      });
    });
  });

  describe("unknown formats", () => {
    it("throws when not .md", () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new MarkdownAdrFilename("0001-lorem-ipsum.txt");
      }).toThrow();
    });

    it("returns an error when impossible to extract number", () => {
      expect(
        new MarkdownAdrFilename("lorem-ipsum.md").extractAdrNumber().isErr()
      ).toBeTruthy();
      expect(
        new MarkdownAdrFilename("lorem-ipsum-0001.md")
          .extractAdrNumber()
          .isErr()
      ).toBeTruthy();
    });
  });
});

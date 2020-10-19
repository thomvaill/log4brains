import { MarkdownBody } from "./MarkdownBody";

describe("MarkdownBody", () => {
  describe("getFirstH1Title()", () => {
    it("returns the first H1 title", () => {
      const body = new MarkdownBody(
        `# First title
Lorem ipsum
## Subtitle
## Subtitle
# Second title`
      );
      expect(body.getFirstH1Title()).toEqual("First title");
    });

    it("returns undefined when there is no first title", () => {
      const body = new MarkdownBody(
        `Lorem ipsum
## Subtitle
## Subtitle`
      );
      expect(body.getFirstH1Title()).toBeUndefined();
    });
  });

  describe("setFirstH1Title()", () => {
    it("replaces the existing one", () => {
      const body = new MarkdownBody(
        `# First title
Lorem ipsum
## Subtitle
## Subtitle
# Second title`
      );
      body.setFirstH1Title("New title");
      expect(body.getRawMarkdown()).toEqual(`# New title
Lorem ipsum
## Subtitle
## Subtitle
# Second title`);
    });

    it("creates one if needed", () => {
      const body = new MarkdownBody(
        `Lorem ipsum
## Subtitle
## Subtitle`
      );
      body.setFirstH1Title("New title");
      expect(body.getRawMarkdown()).toEqual(`# New title
Lorem ipsum
## Subtitle
## Subtitle`);
    });
  });
});

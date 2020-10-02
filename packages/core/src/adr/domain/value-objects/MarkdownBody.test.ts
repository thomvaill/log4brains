import { MarkdownBody } from "./MarkdownBody";

describe("MarkdownBody", () => {
  describe("getFirstH1Title()", () => {
    it("returns the first H1 title", () => {
      const body = MarkdownBody.create(
        `# First title
Lorem ipsum
## Subtitle
## Subtitle
# Second title`
      );
      expect(body.getFirstH1Title()).toEqual("First title");
    });

    it("returns undefined when there is no first title", () => {
      const body = MarkdownBody.create(
        `Lorem ipsum
## Subtitle
## Subtitle`
      );
      expect(body.getFirstH1Title()).toBeUndefined();
    });
  });
});

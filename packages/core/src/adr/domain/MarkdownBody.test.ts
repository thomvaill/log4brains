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

  describe("getHeaderMetadata()", () => {
    it("returns a metadata", () => {
      const body = new MarkdownBody(
        `# Hello World

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`
      );
      expect(body.getHeaderMetadata("status")).toEqual("draft");
      expect(body.getHeaderMetadata("date")).toEqual("2020-01-01");
    });

    it("returns a metadata even if there is a paragraph before", () => {
      const body = new MarkdownBody(
        `# Hello World
Hello!

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`
      );
      expect(body.getHeaderMetadata("status")).toEqual("draft");
      expect(body.getHeaderMetadata("date")).toEqual("2020-01-01");
    });

    it("returns undefined when the metadata is not set", () => {
      const body = new MarkdownBody(
        `# Hello World
Hello!

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`
      );
      expect(body.getHeaderMetadata("Deciders")).toBeUndefined();
    });
  });

  describe("setHeaderMetadata()", () => {
    it("modifies an already existing metadata", () => {
      const body = new MarkdownBody(
        `# Hello World
Hello!

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`
      );

      body.setHeaderMetadata("Status", "accepted");

      expect(body.getRawMarkdown()).toEqual(`# Hello World
Hello!

- Lorem Ipsum
- Status: accepted
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`);
    });

    it("creates a metadata", () => {
      const body = new MarkdownBody(
        `# Hello World
Hello!

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`
      );

      body.setHeaderMetadata("Deciders", "@JohnDoe");

      expect(body.getRawMarkdown()).toEqual(`# Hello World
Hello!

- Lorem Ipsum
- Status: draft
-  DATE :   2020-01-01
- Deciders: @JohnDoe

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`);
    });
  });
});

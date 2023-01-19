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

    it("ignores inline comments", () => {
      const body = new MarkdownBody(
        `# Hello World

- Lorem Ipsum
- Status: proposed <!-- [draft | proposed | rejected | accepted | deprecated | … | superseded by [xxx](yyyymmdd-xxx.md)] -->
- DATE :   2020-01-01
- Tags: test, blah <!-- optional -->

Technical Story: [description | ticket/issue URL] <!-- optional -->
## Subtitle
## Subtitle
# Second title`
      );
      expect(body.getHeaderMetadata("status")).toEqual("proposed");
      expect(body.getHeaderMetadata("date")).toEqual("2020-01-01");
      expect(body.getHeaderMetadata("tags")).toEqual("test, blah");
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

    it("creates a metadata even if the paragraph does not exist", () => {
      const body = new MarkdownBody(
        `# Hello World

## Subtitle
## Subtitle
# Second title`
      );

      body.setHeaderMetadata("Deciders", "@JohnDoe");

      expect(body.getRawMarkdown()).toEqual(`# Hello World

- Deciders: @JohnDoe


## Subtitle
## Subtitle
# Second title`);
    });
  });

  describe("getlinks()", () => {
    it("returns links", () => {
      const body = new MarkdownBody(
        `# Hello World
## Subtitle

- test

## Subtitle
## Links

- link1: [foo](bar.md)
- link2`
      );
      expect(body.getLinks()).toEqual(["link1: [foo](bar.md)", "link2"]);
    });

    it("returns undefined when no links", () => {
      const body = new MarkdownBody(
        `# Hello World
## Subtitle

- test

## Subtitle`
      );
      expect(body.getLinks()).toBeUndefined();
    });
  });

  describe("addLink()", () => {
    it("adds a link", () => {
      const body = new MarkdownBody(
        `# Hello World
## Subtitle
## Links

- link1: [foo](bar.md)
- link2

`
      ); // TODO: fix this whitespace issue

      body.addLink("link3");

      expect(body.getRawMarkdown()).toEqual(`# Hello World
## Subtitle
## Links

- link1: [foo](bar.md)
- link2
- link3

`);
    });

    it("adds a link even if the paragraph does not exist", () => {
      const body = new MarkdownBody(
        `# Hello World
## Subtitle
Lorem ipsum`
      ); // TODO: fix this whitespace issue

      body.addLink("link1");

      expect(body.getRawMarkdown()).toEqual(`# Hello World
## Subtitle
Lorem ipsum

## Links

- link1

`);
    });
  });

  describe("addLinkNoDuplicate()", () => {
    it("does not add the link if there is a duplicate", () => {
      const body = new MarkdownBody(
        `# Hello World
## Subtitle
## Links

- link test

`
      ); // TODO: fix this whitespace issue

      body.addLinkNoDuplicate("Link TEST");
      body.addLinkNoDuplicate("Link2");

      expect(body.getRawMarkdown()).toEqual(`# Hello World
## Subtitle
## Links

- link test
- Link2

`);
    });
  });
});

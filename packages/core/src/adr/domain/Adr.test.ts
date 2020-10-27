import { Adr } from "./Adr";
import { AdrSlug } from "./AdrSlug";
import { AdrStatus } from "./AdrStatus";
import { MarkdownBody } from "./MarkdownBody";

describe("Adr", () => {
  describe("get title()", () => {
    it("returns the title", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# Lorem Ipsum`)
      });
      expect(adr.title).toEqual("Lorem Ipsum");
    });

    it("returns undefined when no title", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`## Subtitle`)
      });
      expect(adr.title).toBeUndefined();
    });
  });

  describe("get status()", () => {
    it("returns the status", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# My ADR

  - Status: accepted
  `)
      });
      expect(adr.status.equals(AdrStatus.ACCEPTED)).toBeTruthy();
    });

    it("returns the SUPERSEDED special status", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# My ADR

  - Status: superseded by XXX
  `)
      });
      expect(adr.status.equals(AdrStatus.SUPERSEDED)).toBeTruthy();
    });

    it("returns the default status", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# My ADR`)
      });
      expect(adr.status.equals(AdrStatus.ACCEPTED)).toBeTruthy();
    });
  });

  describe("get superseder()", () => {
    it("returns undefined when no relevant", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# My ADR

  - Status: accepted
  `)
      });
      expect(adr.superseder).toBeUndefined();
    });

    it("returns the superseder", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# My ADR

  - Status: superseded by foo/bar
  `)
      });
      expect(adr.superseder?.value).toEqual("foo/bar");
    });
  });

  describe("get tags()", () => {
    it("returns the tags", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# My ADR

  - Tags: frontend,BaCkEnD with-space, with-space-and-comma,      with-a-lot-of-spaces
  `)
      });
      expect(adr.tags).toEqual([
        "frontend",
        "backend",
        "with-space",
        "with-space-and-comma",
        "with-a-lot-of-spaces"
      ]);
    });

    it("returns no tags", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# My ADR

  - Status: accepted
  `)
      });
      expect(adr.tags).toEqual([]);
    });
  });

  describe("get deciders()", () => {
    it("returns the deciders", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# My ADR

  - Deciders: John Doe,Lorem Ipsum test   , FOO BAR,bar
  `)
      });
      expect(adr.deciders).toEqual([
        "John Doe",
        "Lorem Ipsum test",
        "FOO BAR",
        "bar"
      ]);
    });

    it("returns no deciders", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# My ADR

  - Status: accepted
  `)
      });
      expect(adr.deciders).toEqual([]);
    });
  });

  describe("getEnhancedMdx()", () => {
    test("default case", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# My ADR

- Status: accepted
- Deciders: John Doe, Lorem Ipsum
- Date: 2020-01-01
- Tags: foo bar

## Subtitle

Hello
`)
      });

      expect(adr.getEnhancedMdx()).toEqual(`
## Subtitle

Hello
`);
    });

    test("with additional information", () => {
      const adr = new Adr({
        slug: new AdrSlug("test"),
        body: new MarkdownBody(`# My ADR

Hello this is a paragraph.

- Status: accepted
- Deciders: John Doe, Lorem Ipsum
- Date: 2020-01-01
- Unknown Metadata: test
- Tags: foo bar
- Unknown Metadata2: test2

Technical Story: test

## Subtitle

Hello
`)
      });

      expect(adr.getEnhancedMdx()).toEqual(`
Hello this is a paragraph.

- Unknown Metadata: test
- Unknown Metadata2: test2

Technical Story: test

## Subtitle

Hello
`);
    });
  });
});

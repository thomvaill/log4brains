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
});

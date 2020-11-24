import { Adr } from "./Adr";
import { AdrFile } from "./AdrFile";
import { AdrSlug } from "./AdrSlug";
import { FilesystemPath } from "./FilesystemPath";
import { MarkdownAdrLink } from "./MarkdownAdrLink";
import { MarkdownBody } from "./MarkdownBody";
import { PackageRef } from "./PackageRef";

describe("MarkdownAdrLink", () => {
  beforeAll(() => {
    Adr.setTz("Etc/UTC");
  });
  afterAll(() => {
    Adr.clearTz();
  });

  it("works with relative paths", () => {
    const from = new Adr({
      slug: new AdrSlug("from"),
      file: new AdrFile(new FilesystemPath("/", "docs/adr/from.md")),
      body: new MarkdownBody("")
    });
    const to = new Adr({
      slug: new AdrSlug("test/to"),
      package: new PackageRef("test"),
      file: new AdrFile(
        new FilesystemPath("/", "packages/test/docs/adr/to.md")
      ),
      body: new MarkdownBody("")
    });
    const link = new MarkdownAdrLink(from, to);
    expect(link.toMarkdown()).toEqual(
      "[test/to](../../packages/test/docs/adr/to.md)"
    );
  });
});

import { Adr } from "./Adr";
import { AdrFile } from "./AdrFile";
import { AdrRelation } from "./AdrRelation";
import { AdrSlug } from "./AdrSlug";
import { FilesystemPath } from "./FilesystemPath";
import { MarkdownBody } from "./MarkdownBody";
import { PackageRef } from "./PackageRef";

describe("AdrRelation", () => {
  it("correctly prints to markdown", () => {
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

    const relation1 = new AdrRelation(from, "superseded by", to);
    expect(relation1.toMarkdown()).toEqual(
      "superseded by [test/to](../../packages/test/docs/adr/to.md)"
    );

    const relation2 = new AdrRelation(from, "refines", to);
    expect(relation2.toMarkdown()).toEqual(
      "refines [test/to](../../packages/test/docs/adr/to.md)"
    );
  });
});

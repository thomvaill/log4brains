import { AdrFile } from "./AdrFile";
import { AdrSlug } from "./AdrSlug";
import { FilesystemPath } from "./FilesystemPath";

describe("AdrFile", () => {
  it("throws when not .md", () => {
    expect(() => {
      new AdrFile(new FilesystemPath("/", "test"));
    }).toThrow();
  });

  it("throws when template.md", () => {
    expect(() => {
      new AdrFile(new FilesystemPath("/", "template.md"));
    }).toThrow();
  });

  it("creates from slug in folder", () => {
    expect(
      AdrFile.createFromSlugInFolder(
        new FilesystemPath("/", "test"),
        new AdrSlug("my-package/20200101-hello-world")
      ).path.absolutePath
    ).toEqual("/test/20200101-hello-world.md");
  });
});

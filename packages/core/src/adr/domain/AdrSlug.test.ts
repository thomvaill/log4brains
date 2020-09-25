import { AdrFile } from "./AdrFile";
import { AdrSlug } from "./AdrSlug";
import { FilesystemPath } from "./FilesystemPath";
import { PackageRef } from "./PackageRef";

describe("AdrSlug", () => {
  it("returns the package part", () => {
    expect(new AdrSlug("my-package/0001-test").packagePart).toEqual(
      "my-package"
    );
    expect(new AdrSlug("0001-test").packagePart).toBeUndefined();
  });

  it("returns the name part", () => {
    expect(new AdrSlug("my-package/0001-test").namePart).toEqual("0001-test");
    expect(new AdrSlug("0001-test").namePart).toEqual("0001-test");
  });

  describe("createFromFile()", () => {
    it("creates from AdrFile with package", () => {
      expect(
        AdrSlug.createFromFile(
          new AdrFile(new FilesystemPath("/", "0001-my-adr.md")),
          new PackageRef("my-package")
        ).value
      ).toEqual("my-package/0001-my-adr");
    });

    it("creates from AdrFile without package", () => {
      expect(
        AdrSlug.createFromFile(
          new AdrFile(new FilesystemPath("/", "0001-my-adr.md"))
        ).value
      ).toEqual("0001-my-adr");
    });
  });

  describe("createFromTitle()", () => {
    it("creates from title with package", () => {
      expect(
        AdrSlug.createFromTitle(
          "My ADR",
          new PackageRef("my-package"),
          new Date(2020, 0, 1)
        ).value
      ).toEqual("my-package/20200101-my-adr");
    });

    it("creates from title without package", () => {
      expect(
        AdrSlug.createFromTitle("My ADR", undefined, new Date(2020, 0, 1)).value
      ).toEqual("20200101-my-adr");
    });

    it("creates from title with complex title", () => {
      expect(
        AdrSlug.createFromTitle(
          "L'exemple d'un titre compliqué ! @test",
          undefined,
          new Date(2020, 0, 1)
        ).value
      ).toEqual("20200101-lexemple-dun-titre-complique-test");
    });
  });
});

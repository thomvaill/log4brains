import { AdrFile } from "./AdrFile";
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
});

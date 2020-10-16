import { FilesystemPath } from "./FilesystemPath";

describe("FilesystemPath", () => {
  it("throws when CWD is not absolute", () => {
    expect(() => {
      new FilesystemPath(".", "test");
    }).toThrow();
  });

  it("returns the absolute path", () => {
    expect(new FilesystemPath("/foo", "./bar/test").absolutePath).toEqual(
      "/foo/bar/test"
    );
    expect(new FilesystemPath("/foo", "bar/test").absolutePath).toEqual(
      "/foo/bar/test"
    );
    expect(new FilesystemPath("/foo/bar", "../test").absolutePath).toEqual(
      "/foo/test"
    );
  });

  it("returns the basename", () => {
    expect(new FilesystemPath("/foo", "bar/test").basename).toEqual("test");
    expect(new FilesystemPath("/foo", "bar/test.md").basename).toEqual(
      "test.md"
    );
  });

  it("returns the extension", () => {
    expect(new FilesystemPath("/foo", "bar/test").extension).toEqual("");
    expect(new FilesystemPath("/foo", "bar/test.md").extension).toEqual(".md");
  });

  it("returns the basename without the extension", () => {
    expect(
      new FilesystemPath("/foo", "bar/test").basenameWithoutExtension
    ).toEqual("test");
    expect(
      new FilesystemPath("/foo", "bar/test.md").basenameWithoutExtension
    ).toEqual("test");
  });
});

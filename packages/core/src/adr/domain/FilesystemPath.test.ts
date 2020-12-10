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

  it("joins a FilesystemPath to a string path", () => {
    expect(
      new FilesystemPath("/foo", "bar/test").join("hello-world.md").absolutePath
    ).toEqual("/foo/bar/test/hello-world.md");
  });

  it("returns the relative path between two paths (from a directory)", () => {
    const from = new FilesystemPath("/test", "foo/bar");
    expect(from.relative(new FilesystemPath("/test", "foo"), true)).toEqual(
      ".."
    );
    expect(
      from.relative(new FilesystemPath("/test", "foo/lorem/ipsum"), true)
    ).toEqual("../lorem/ipsum");
    expect(
      from.relative(new FilesystemPath("/test", "foo/bar/test"), true)
    ).toEqual("test");
  });

  it("returns the relative path between two paths (from a file)", () => {
    const from = new FilesystemPath("/test", "foo/bar.md");
    expect(from.relative(new FilesystemPath("/test", "foo"), false)).toEqual(
      ""
    );
    expect(
      from.relative(new FilesystemPath("/test", "foo/lorem/ipsum"), false)
    ).toEqual("lorem/ipsum");
    expect(
      from.relative(new FilesystemPath("/test", "bar/test"), false)
    ).toEqual("../bar/test");
  });
});

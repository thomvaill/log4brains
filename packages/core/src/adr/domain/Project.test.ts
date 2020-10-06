/* eslint-disable jest/no-conditional-expect */
import { Project } from "./Project";
import { FolderPath, FolderReference } from "./value-objects";

describe("Project", () => {
  it("detects if root folder is registered", () => {
    const project = new Project("test");
    project.registerFolder(FolderReference.createRoot(), new FolderPath("/"));
    expect(project.isRootFolderRegistered()).toBeTruthy();
  });

  it("retreives folder path", () => {
    const root = FolderReference.createRoot();
    const test = FolderReference.create("test");
    const path1 = new FolderPath("/");
    const path2 = new FolderPath("/test");
    const project = new Project("test");
    project.registerFolder(root, path1);
    project.registerFolder(test, path2);
    const pathRes1 = project.getFolderPath(root);
    expect(pathRes1).toBeDefined();
    if (pathRes1) expect(pathRes1.equals(path1)).toBeTruthy();
    const pathRes2 = project.getFolderPath(test);
    expect(pathRes2).toBeDefined();
    if (pathRes2) expect(pathRes2.equals(path2)).toBeTruthy();
  });

  it("accepts only one root folder", () => {
    const project = new Project("test");
    project.registerFolder(FolderReference.createRoot(), new FolderPath("/"));

    expect(() => {
      project.registerFolder(FolderReference.createRoot(), new FolderPath("/"));
    }).toThrow();
  });

  it("throws when there are duplicated folder names", () => {
    const project = new Project("test");
    project.registerFolder(FolderReference.create("test"), new FolderPath("/"));

    expect(() => {
      project.registerFolder(
        FolderReference.create("test"),
        new FolderPath("/")
      );
    }).toThrow();
  });
});

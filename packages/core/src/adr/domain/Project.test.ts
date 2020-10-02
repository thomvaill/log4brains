/* eslint-disable jest/no-conditional-expect */
import { Project } from "./Project";
import { FolderPath, FolderReference } from "./value-objects";

describe("Project", () => {
  it("detects if root folder is registered", () => {
    const project = Project.create("test");
    project.registerFolder(
      FolderReference.createRoot(),
      FolderPath.create("/")
    );
    expect(project.isRootFolderRegistered()).toBeTruthy();
  });

  it("retreives folder path", () => {
    const root = FolderReference.createRoot();
    const test = FolderReference.create("test");
    const path1 = FolderPath.create("/");
    const path2 = FolderPath.create("/test");
    const project = Project.create("test");
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
    const project = Project.create("test");
    const res1 = project.registerFolder(
      FolderReference.createRoot(),
      FolderPath.create("/")
    );
    expect(res1.isOk()).toBeTruthy();
    const res2 = project.registerFolder(
      FolderReference.createRoot(),
      FolderPath.create("/")
    );
    expect(res2.isOk()).toBeFalsy();
  });

  it("refuses duplicated folder names", () => {
    const project = Project.create("test");
    const res1 = project.registerFolder(
      FolderReference.create("test"),
      FolderPath.create("/")
    );
    expect(res1.isOk()).toBeTruthy();
    const res2 = project.registerFolder(
      FolderReference.create("test"),
      FolderPath.create("/")
    );
    expect(res2.isOk()).toBeFalsy();
  });
});

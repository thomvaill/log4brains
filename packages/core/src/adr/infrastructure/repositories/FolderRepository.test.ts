/* eslint-disable jest/no-conditional-expect */
/* eslint-disable no-underscore-dangle */
import { FolderPath, FolderReference } from "../../domain/value-objects";
import { FolderRepository } from "./FolderRepository";

describe("FolderRepository", () => {
  describe("load()", () => {
    const repo = new FolderRepository();

    it("loads the `simple` folder example without any warning", async () => {
      const folderRes = await repo.load(
        FolderReference.create("simple"),
        FolderPath.create("tests/example-project/simple")
      );
      expect(folderRes.isOk()).toBeTruthy();
      if (folderRes.isOk()) {
        const folder = folderRes.value;
        expect(folder.adrs).toHaveLength(2);
        expect(folder.hasErrorsInSelfOrChildren()).toBeFalsy();
      }
    });

    it("loads the `with-warnings` folder example with warnings", async () => {
      const folderRes = await repo.load(
        FolderReference.create("with-warnings"),
        FolderPath.create("tests/example-project/with-warnings")
      );
      expect(folderRes.isOk()).toBeTruthy();
      if (folderRes.isOk()) {
        const folder = folderRes.value;
        expect(folder.adrs).toHaveLength(3);
        expect(folder.hasErrorsInSelfOrChildren()).toBeTruthy();
      }
    });
  });
});

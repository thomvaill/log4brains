import { FolderPath, FolderReference } from "../../domain/value-objects";
import { FolderRepository } from "./FolderRepository";

describe("FolderRepository", () => {
  describe("load()", () => {
    const repo = new FolderRepository();

    it("loads the `simple` folder example without any warning", async () => {
      const folder = await repo.load(
        FolderReference.create("simple"),
        new FolderPath("tests/example-project/simple")
      );

      expect(folder.adrs).toHaveLength(2);
      expect(folder.getSelfAndChildrenDiagnostics()).toHaveLength(0);
    });

    it("loads the `with-warnings` folder example with warnings", async () => {
      const folder = await repo.load(
        FolderReference.create("with-warnings"),
        new FolderPath("tests/example-project/with-warnings")
      );

      expect(folder.adrs).toHaveLength(4);
      expect(folder.getSelfAndChildrenDiagnostics()).not.toHaveLength(0);
    });
  });
});

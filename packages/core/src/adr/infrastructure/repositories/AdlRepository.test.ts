import { AdlRepository } from "./AdlRepository";

describe("AdlRepository", () => {
  describe("load()", () => {
    it("loads the `simple` ADL example without any warning", async () => {
      const repo = new AdlRepository({ adrDir: "tests/adl-examples/simple" });
      const adl = await repo.load();
      expect(adl.adrs).toHaveLength(2);
      expect(adl.diagnotics).toHaveLength(0);
    });

    it("loads the `with-warnings` ADL example with warnings", async () => {
      const repo = new AdlRepository({
        adrDir: "tests/adl-examples/with-warnings"
      });
      const adl = await repo.load();
      expect(adl.adrs).toHaveLength(3);
      expect(adl.diagnotics.length).toBeGreaterThan(0);
    });
  });
});

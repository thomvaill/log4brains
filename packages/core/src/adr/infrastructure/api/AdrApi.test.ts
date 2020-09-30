import { buildAdrApi } from "./AdrApi";

describe("AdrApi", () => {
  it("works end-to-end", async () => {
    const adrApi = buildAdrApi({ adrDir: "./tests/adl-examples/simple" });
    const adrs = await adrApi.findAll();
    expect(adrs.length).toBeGreaterThan(0);
  });
});

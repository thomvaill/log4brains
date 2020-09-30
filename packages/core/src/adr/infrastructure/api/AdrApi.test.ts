import { asValue } from "awilix";
import { container } from "../../../infrastructure/di";
import { buildAdrApi } from "./AdrApi";

describe("AdrApi", () => {
  beforeAll(() => {
    container.register({
      adrDir: asValue("./tests/adl-examples/simple")
    });
  });

  it("works end-to-end", async () => {
    const adrApi = buildAdrApi();
    const adrs = await adrApi.findAll();
    expect(adrs.length).toBeGreaterThan(0);
  });
});

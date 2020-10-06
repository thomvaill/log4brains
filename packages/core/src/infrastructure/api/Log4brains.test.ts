import { Log4brains } from "./Log4brains";

describe("E2E", () => {
  it("works on the project example", async () => {
    const instance = Log4brains.create("./tests/example-project");
    const adrs = await instance.getAdrs();
    expect(adrs).toHaveLength(6);
  });
});

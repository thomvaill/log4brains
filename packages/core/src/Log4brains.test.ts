/* eslint-disable jest/no-conditional-expect */
import * as Log4brains from "./Log4brains";

describe("E2E", () => {
  it("works on the project example", async () => {
    const instanceRes = Log4brains.getInstance("./tests/example-project");
    expect(instanceRes.isOk()).toBeTruthy();
    if (instanceRes.isOk()) {
      const instance = instanceRes.value;
      const adrsRes = await instance.findAllAdrs();
      expect(adrsRes.isOk()).toBeTruthy();
      if (adrsRes.isOk()) {
        const adrs = adrsRes.value;
        expect(adrs).toHaveLength(5);
      }
    }
  });
});

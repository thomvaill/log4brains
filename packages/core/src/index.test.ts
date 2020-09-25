import { helloWorld } from "./index";

describe("HelloWorld", () => {
  it("returns test", () => {
    expect(helloWorld()).toBe("test");
  });
});

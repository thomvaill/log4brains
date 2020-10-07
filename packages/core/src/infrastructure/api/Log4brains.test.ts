import { Log4brains } from "./Log4brains";

describe("E2E", () => {
  it("getAdrs() works on the project example", async () => {
    const instance = Log4brains.create("./tests/example-project");
    expect(await instance.getAdrs()).toMatchSnapshot();
  });

  it("getDiagnostics() works on the project example", async () => {
    const instance = Log4brains.create("./tests/example-project");
    expect(await instance.getDiagnostics()).toMatchSnapshot();
  });
});

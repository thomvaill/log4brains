/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import path from "path";
import { Log4brains } from "../src/infrastructure/api/Log4brains";

function prepareDataForSnapshot(data: any): any {
  const json = JSON.stringify(data);
  return JSON.parse(
    json.replace(new RegExp(path.resolve(__dirname), "g"), "/ABSOLUTE-PATH")
  );
}

describe("E2E tests / RO", () => {
  const instance = Log4brains.create(path.join(__dirname, "ro-project"));

  describe("searchAdrs()", () => {
    test("all", async () => {
      const adrs = await instance.searchAdrs();
      expect(adrs.map((adr) => adr.slug)).toMatchSnapshot(); // To see easily the order
      expect(prepareDataForSnapshot(adrs)).toMatchSnapshot();
    });
  });

  describe("generateAdrSlug()", () => {
    test("in global scope", async () => {
      const date = moment().format("YYYYMMDD");
      expect(await instance.generateAdrSlug("My end-to-end test !")).toEqual(
        `${date}-my-end-to-end-test`
      );
    });

    test("in a package", async () => {
      const date = moment().format("YYYYMMDD");
      expect(
        await instance.generateAdrSlug("My end-to-end test !", "package1")
      ).toEqual(`package1/${date}-my-end-to-end-test`);
    });
  });
});

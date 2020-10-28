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

    test("with filter on statuses", async () => {
      const acceptedAdrs = await instance.searchAdrs({
        statuses: ["accepted"]
      });
      expect(
        acceptedAdrs.every((adr) => adr.status === "accepted")
      ).toBeTruthy();

      const supersededAdrs = await instance.searchAdrs({
        statuses: ["superseded"]
      });
      expect(
        supersededAdrs.every((adr) => adr.status === "superseded")
      ).toBeTruthy();

      const acceptedAndSupersededAdrs = await instance.searchAdrs({
        statuses: ["accepted", "superseded"]
      });
      expect(
        acceptedAndSupersededAdrs.every(
          (adr) => adr.status === "accepted" || adr.status === "superseded"
        )
      ).toBeTruthy();

      const acceptedAdrSlugs = acceptedAdrs.map((adr) => adr.slug);
      const supersededAdrSlugs = supersededAdrs.map((adr) => adr.slug);
      const acceptedAndSupersededAdrSlugs = acceptedAndSupersededAdrs.map(
        (adr) => adr.slug
      );
      const a = [...acceptedAdrSlugs, ...supersededAdrSlugs].sort();
      const b = [...acceptedAndSupersededAdrSlugs].sort();
      expect(b).toEqual(a);
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

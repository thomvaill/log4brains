import moment from "moment";
import fs from "fs";
import path from "path";
import { Log4brains } from "./Log4brains";

const EXAMPLE_PATH = "./tests/example-project";

describe("E2E", () => {
  const instance = Log4brains.create(EXAMPLE_PATH);

  describe("RO", () => {
    test("searchAdrs() on the project example", async () => {
      expect(await instance.searchAdrs()).toMatchSnapshot();
    });

    test("generateAdrSlug()", async () => {
      const date = moment().format("YYYYMMDD");
      expect(await instance.generateAdrSlug("My end-to-end test !")).toEqual(
        `${date}-my-end-to-end-test`
      );
      expect(
        await instance.generateAdrSlug("My end-to-end test !", "with-warnings")
      ).toEqual(`with-warnings/${date}-my-end-to-end-test`);
    });
  });

  describe("RW", () => {
    const EXAMPLE_ADR_SLUG = "jest-test";
    const EXAMPLE_ADR_FILE = `simple/${EXAMPLE_ADR_SLUG}.md`;

    const clean = () => {
      try {
        fs.unlinkSync(path.join(EXAMPLE_PATH, EXAMPLE_ADR_FILE));
      } catch (e) {}
    };
    beforeEach(clean);
    afterEach(clean);

    test("createAdrFromTemplate()", async () => {
      await instance.createAdrFromTemplate("jest-test", "Hello World");
      expect(
        fs.existsSync(path.join(EXAMPLE_PATH, EXAMPLE_ADR_FILE))
      ).toBeTruthy();

      expect(async () => {
        await instance.createAdrFromTemplate("jest-test", "Hello World");
      }).toThrow();
    });
  });
});

import moment from "moment";
import fs from "fs";
import path from "path";
import globby from "globby";
import rimraf from "rimraf";
import { Log4brains } from "./Log4brains";

describe("E2E", () => {
  describe("RO tests", () => {
    const instance = Log4brains.create("./tests/ro-project");

    test("searchAdrs() on the project example", async () => {
      expect(await instance.searchAdrs()).toMatchSnapshot(); // TODO: fix absolute paths
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

  describe("RW tests", () => {
    const RW_PROJECT_PATH = "./tests/rw-project";
    const RW_ADR_FOLDER_PATH = `${RW_PROJECT_PATH}/main`;

    const instanceRw = Log4brains.create(RW_PROJECT_PATH);

    const clean = () => {
      globby
        .sync([
          `${RW_ADR_FOLDER_PATH}/*.md`,
          `!${RW_ADR_FOLDER_PATH}/template.md`
        ])
        .forEach((fileToClean) => rimraf.sync(fileToClean));
    };
    beforeEach(clean);
    afterEach(clean);

    test("createAdrFromTemplate()", async () => {
      await instanceRw.createAdrFromTemplate("jest-test", "Hello World");
      expect(
        fs.existsSync(path.join(RW_ADR_FOLDER_PATH, "jest-test.md"))
      ).toBeTruthy();

      await expect(
        instanceRw.createAdrFromTemplate("jest-test", "Hello World")
      ).rejects.toThrow();
    });
  });
});

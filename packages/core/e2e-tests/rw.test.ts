import fs from "fs";
import path from "path";
import globby from "globby";
import rimraf from "rimraf";
import { Log4brains } from "../src/infrastructure/api/Log4brains";

const RW_PROJECT_PATH = path.join(__dirname, "rw-project");
const RW_ADR_FOLDER_PATH = `${RW_PROJECT_PATH}/docs/adr`;

describe("E2E tests / RW", () => {
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
    await instanceRw.createAdrFromTemplate("test1", "Hello World");
    expect(
      fs.existsSync(path.join(RW_ADR_FOLDER_PATH, "test1.md"))
    ).toBeTruthy();

    await expect(
      instanceRw.createAdrFromTemplate(
        "test1",
        "A duplicate with the same slug"
      )
    ).rejects.toThrow();
  });
});

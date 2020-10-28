import path from "path";
import globby from "globby";
import rimraf from "rimraf";
import { Log4brains, AdrDto } from "../src/infrastructure/api";

const PROJECT_PATH = path.join(__dirname, "rw-project");

function clean(): void {
  globby
    .sync([`${PROJECT_PATH}/**/*.md`, `!${PROJECT_PATH}/**/template.md`])
    .forEach((fileToClean) => rimraf.sync(fileToClean));
}

function getAdrBySlug(slug: string, adrs: AdrDto[]): AdrDto | undefined {
  return adrs.filter((adr) => adr.slug === slug).pop();
}

describe("E2E tests / RW", () => {
  beforeAll(clean);
  afterAll(clean);

  const instance = Log4brains.create(PROJECT_PATH);

  describe("createAdrFromTemplate()", () => {
    test("in global scope", async () => {
      await instance.createAdrFromTemplate(
        "create-adr-from-template",
        "Hello World"
      );

      const adrs = await instance.searchAdrs();
      const adr = getAdrBySlug("create-adr-from-template", adrs);

      expect(adr).toBeDefined();
      expect(adr?.title).toEqual("Hello World");
      expect(adr?.status).toEqual("draft");
      expect(adr?.package).toBeNull();
      expect(adr?.body.enhancedMdx).toMatchSnapshot();
    });

    test("in package with custom template", async () => {
      await instance.createAdrFromTemplate(
        "package1/create-adr-from-template-package-custom-template",
        "Foo Bar"
      );

      const adrs = await instance.searchAdrs();
      const adr = getAdrBySlug(
        "package1/create-adr-from-template-package-custom-template",
        adrs
      );

      expect(adr).toBeDefined();
      expect(adr?.title).toEqual("Foo Bar");
      expect(adr?.status).toEqual("draft");
      expect(adr?.package).toEqual("package1");
      expect(adr?.body.enhancedMdx).toMatchSnapshot();
    });

    test("in package with global template", async () => {
      await instance.createAdrFromTemplate(
        "package2/create-adr-from-template-package-global-template",
        "Foo Baz"
      );

      const adrs = await instance.searchAdrs();
      const adr = getAdrBySlug(
        "package2/create-adr-from-template-package-global-template",
        adrs
      );

      expect(adr).toBeDefined();
      expect(adr?.title).toEqual("Foo Baz");
      expect(adr?.status).toEqual("draft");
      expect(adr?.package).toEqual("package2");
      expect(adr?.body.enhancedMdx).toMatchSnapshot();
    });

    test("slug duplication", async () => {
      await instance.createAdrFromTemplate("duplicated-slug", "Hello World");
      await expect(
        instance.createAdrFromTemplate("duplicated-slug", "Hello World 2")
      ).rejects.toThrow();
    });

    test("unknown package", async () => {
      await expect(
        instance.createAdrFromTemplate("unknown-package/test", "Hello World")
      ).rejects.toThrow();
    });
  });

  describe("supersedeAdr()", () => {
    test("basic", async () => {
      await instance.createAdrFromTemplate("superseded", "Superseded");
      await instance.createAdrFromTemplate("superseder", "Superseder");
      await instance.supersedeAdr("superseded", "superseder");

      const adrs = await instance.searchAdrs();
      const superseded = getAdrBySlug("superseded", adrs);
      const superseder = getAdrBySlug("superseder", adrs);

      expect(superseded?.status).toEqual("superseded");
      expect(superseded?.supersededBy).toEqual(superseder?.slug);
      expect(superseder?.body.enhancedMdx).toMatchSnapshot();
    });
  });
});

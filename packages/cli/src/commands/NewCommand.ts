import path from "path";
import openEditor from "open-editor";
import { Log4brains } from "@log4brains/core";
import { Console } from "../console";

type Deps = {
  l4bInstance: Log4brains;
  appConsole: Console;
};

export class NewCommand {
  private readonly l4bInstance: Log4brains;

  private readonly console: Console;

  constructor({ l4bInstance, appConsole }: Deps) {
    this.l4bInstance = l4bInstance;
    this.console = appConsole;
  }

  private detectCurrentPackageFromCwd(): string | undefined {
    const { packages } = this.l4bInstance.config.project;
    if (!packages) {
      return undefined;
    }
    const cwd = path.resolve(".");
    const match = packages
      .filter((pkg) => cwd.includes(pkg.path))
      .sort((a, b) => a.path.length - b.path.length)
      .pop(); // returns the most precise path (ie. longest)
    return match?.name;
  }

  async execute(): Promise<void> {
    const { packages } = this.l4bInstance.config.project;

    let pkg;
    if (packages && packages.length > 0) {
      const currentPackage = this.detectCurrentPackageFromCwd();
      const packageChoices = [
        {
          name: `Root folder (${this.l4bInstance.config.project.adrFolder})`,
          value: "",
          short: "Root folder"
        },
        ...packages.map((p) => ({
          name: `Package: ${p.name} (${p.adrFolder})`,
          value: p.name,
          short: `Package: ${p.name}`
        }))
      ];
      pkg =
        (await this.console.askListQuestion(
          "Where do you want to create this new ADR?",
          packageChoices,
          currentPackage
        )) || undefined;
    }

    const title = await this.console.askInputQuestion(
      "Enter a title for this new ADR"
    );
    const slug = await this.console.askInputQuestion(
      "We pre-generated a slug for this ADR. It will be used in its filename and for further reference. You can edit it if you want, or just press [ENTER].",
      await this.l4bInstance.generateAdrSlug(title, pkg)
    );

    const adrDto = await this.l4bInstance.createAdrFromTemplate(slug, title);

    const activeAdrs = await this.l4bInstance.searchAdrs({
      statuses: ["accepted"]
    });
    if (activeAdrs.length > 0) {
      const supersedeChoices = [
        {
          name: "No",
          value: ""
        },
        ...activeAdrs.map((a) => ({
          name: a.title || "Untitled",
          value: a.slug
        }))
      ];
      const supersededSlug = await this.console.askListQuestion(
        "Does this ADR supersede a previous one?",
        supersedeChoices,
        ""
      );

      if (supersededSlug !== "") {
        await this.l4bInstance.supersedeAdr(supersededSlug, slug);
        this.console.info(`${supersededSlug} marked as superseded by ${slug}`);
      }
    }

    this.console.success(`New ADR created: ${adrDto.file.relativePath}`);

    const actionChoices = [
      {
        name:
          "Open file in default editor + open log4brains preview in browser",
        value: "edit-and-preview"
      },
      { name: "Open file in default editor", value: "edit" },
      { name: "Do not edit now", value: "close" }
    ];
    const action = await this.console.askListQuestion(
      "How would you like to edit it?",
      actionChoices,
      "edit-and-preview"
    );

    switch (action) {
      case "edit-and-preview": // TODO
      case "edit":
        openEditor([adrDto.file.absolutePath]);
        break;

      default:
        process.exit(0);
        break;
    }
  }
}

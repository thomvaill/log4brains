/* eslint-disable sonarjs/no-duplicate-string */
import path from "path";
import { Log4brains, Log4brainsError } from "@log4brains/core";
import fs, { promises as fsP } from "fs";
import { Console } from "../console";

type Deps = {
  l4bInstance: Log4brains;
  appConsole: Console;
};

export type NewCommandOpts = {
  quiet: boolean;
  package?: string;
  from?: string;
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

  async execute(opts: NewCommandOpts, titleArg?: string): Promise<void> {
    const { packages } = this.l4bInstance.config.project;

    let pkg = opts.package;
    if (!opts.quiet && !pkg && packages && packages.length > 0) {
      const currentPackage = this.detectCurrentPackageFromCwd();
      const packageChoices = [
        {
          name: `Global`,
          value: ""
        },
        ...packages.map((p) => ({
          name: `Package: ${p.name}`,
          value: p.name
        }))
      ];
      pkg =
        (await this.console.askListQuestion(
          "For which package do you want to create this new ADR?",
          packageChoices,
          currentPackage
        )) || undefined;
    }

    if (opts.quiet && !titleArg) {
      throw new Log4brainsError("<title> is required when using --quiet");
    }
    const title =
      titleArg ||
      (await this.console.askInputQuestion(
        "Please enter a short title of the solved problem and optionally its solution"
      ));

    // const slug = await this.console.askInputQuestion(
    //   "We pre-generated a slug to identify this ADR. Press [ENTER] or enter another one.",
    //   await this.l4bInstance.generateAdrSlug(title, pkg)
    // );
    const slug = await this.l4bInstance.generateAdrSlug(title, pkg);

    const adrDto = await this.l4bInstance.createAdrFromTemplate(slug, title);

    // --from option (used by @log4brains/init to create the starter ADRs)
    // Since this is a private use case, we don't include it in CORE for now
    if (opts.from) {
      if (!fs.existsSync(opts.from)) {
        throw new Log4brainsError("The given file does not exist", opts.from);
      }
      // TODO: use streams
      await fsP.writeFile(
        adrDto.file.absolutePath,
        await fsP.readFile(opts.from, "utf-8"),
        "utf-8"
      );
    }

    if (opts.quiet) {
      this.console.print(adrDto.slug);
      process.exit(0);
    }

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
          name: a.title || "Untitled", // TODO: add package and maybe date + format with tabs
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
        await this.l4bInstance.openAdrInEditor(slug, () => {
          this.console.warn(
            "We were not able to detect your preferred editor :("
          );
          this.console.warn(
            "You can define it by setting your $VISUAL or $EDITOR environment variable in ~/.zshenv or ~/.bashrc"
          );
        });
        break;

      default:
        process.exit(0);
        break;
    }
  }
}

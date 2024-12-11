/* eslint-disable no-await-in-loop */
/* eslint-disable class-methods-use-this */
import fs, { promises as fsP } from "fs";
import terminalLink from "terminal-link";
import chalk from "chalk";
import execa from "execa";
import mkdirp from "mkdirp";
import yaml from "yaml";
import path from "path";
import moment from "moment-timezone";
import type { AppConsole } from "@log4brains/cli-common";
import { FailureExit } from "@log4brains/cli-common";
import { replaceAllInFile } from "../utils";

const assetsPath = path.resolve(path.join(__dirname, "../assets")); // only one level up because bundled with microbundle
const docLink = "https://github.com/thomvaill/log4brains";

function forceUnixPath(p: string): string {
  return p.replace(/\\/g, "/");
}

export type InitCommandOpts = {
  defaults: boolean;
};

type L4bYmlPackageConfig = {
  name: string;
  path: string;
  adrFolder: string;
};
type L4bYmlConfig = {
  project: {
    name: string;
    tz: string;
    adrFolder: string;
    packages?: L4bYmlPackageConfig[];
  };
};

type Deps = {
  appConsole: AppConsole;
};

export class InitCommand {
  private readonly console: AppConsole;

  constructor({ appConsole }: Deps) {
    this.console = appConsole;
  }

  private guessMainAdrFolderPath(cwd: string): string | undefined {
    const usualPaths = [
      "./docs/adr",
      "./docs/adrs",
      "./docs/architecture-decisions",
      "./doc/adr",
      "./doc/adrs",
      "./doc/architecture-decisions",
      "./adr",
      "./adrs",
      "./architecture-decisions"
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const possiblePath of usualPaths) {
      if (fs.existsSync(path.join(cwd, possiblePath))) {
        return possiblePath;
      }
    }
    return undefined;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private async buildLog4brainsConfigInteractively(
    cwd: string,
    noInteraction: boolean
  ): Promise<L4bYmlConfig> {
    this.console.println(chalk.bold("👋 Welcome to Log4brains!"));
    this.console.println();
    this.console.println(
      "This interactive script will help you configure Log4brains for your project."
    );
    this.console.println(
      `It will create the ${chalk.cyan(".log4brains.yml")} config file,`
    );
    this.console.println("        copy the default ADR template,");
    this.console.println("        and create your first ADR for you!");
    this.console.println();
    this.console.println(
      "Before going further, please check that you are running this command"
    );
    this.console.println(
      "from the root folder of your project's git repository:"
    );
    this.console.println(chalk.cyan(cwd));

    // Continue?
    if (
      !noInteraction &&
      !(await this.console.askYesNoQuestion("Continue?", true))
    ) {
      process.exit(0);
    }

    this.console.println();
    this.console.println(
      "👍 We will now ask you several questions to get you started:"
    );

    // Name
    let name;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,global-require,import/no-dynamic-require,@typescript-eslint/no-var-requires
      name = require(path.join(cwd, "package.json")).name as string;
    } catch (e) {
      // ignore
    }

    name = noInteraction
      ? name || "untitled"
      : await this.console.askInputQuestionAndValidate(
          "What is the name of your project?",
          (answer) => !!answer.trim(),
          name
        );

    // Project type
    const type = noInteraction
      ? "mono"
      : await this.console.askListQuestion(
          "Which statement describes the best your project?",
          [
            {
              name: "Simple project (only one ADR folder)",
              value: "mono",
              short: "Mono-package project"
            },
            {
              name:
                "Multi-package project (one ADR folder per package + a global one)",
              value: "multi",
              short: "Multi-package project"
            }
          ]
        );

    // Main ADR folder location
    let adrFolder = this.guessMainAdrFolderPath(cwd);
    if (adrFolder) {
      this.console.println();
      this.console.println(
        `${chalk.blue.bold(
          "i We have detected a folder with existing ADRs:"
        )} ${chalk.cyan(adrFolder)}`
      );
      adrFolder =
        noInteraction ||
        (await this.console.askYesNoQuestion(
          "Do you want to use it? (existing ADRs will be kept)",
          true
        ))
          ? adrFolder
          : undefined;
    }
    if (!adrFolder) {
      adrFolder = noInteraction
        ? "./docs/adr"
        : await this.console.askInputQuestionAndValidate(
            `In which directory do you plan to store your ${
              type === "multi" ? "global " : ""
            }ADRs? (will be automatically created)`,
            (answer) => !!answer.trim(),
            "./docs/adr"
          );
    }
    await mkdirp(path.join(cwd, adrFolder));
    this.console.println();

    // Packages
    const packages = [];
    if (type === "multi") {
      this.console.println("We will now define your packages...");
      this.console.println();

      let oneMorePackage = false;
      let packageNumber = 1;
      do {
        this.console.println();
        this.console.println(
          `  ${chalk.underline(`Package #${packageNumber}`)}:`
        );
        const pkgName = await this.console.askInputQuestionAndValidate(
          "Name? (short, lowercase, without special characters, nor spaces)",
          (answer) => !!answer.trim()
        );
        const pkgCodeFolder = await this.askPathWhileNotFound(
          "Where is the source code of this package located?",
          cwd,
          `./packages/${pkgName}`
        );
        const pkgAdrFolder = await this.console.askInputQuestionAndValidate(
          `In which directory do you plan to store the ADRs of this package? (will be automatically created)`,
          (answer) => !!answer.trim(),
          `${pkgCodeFolder}/docs/adr`
        );
        await mkdirp(path.join(cwd, pkgAdrFolder));
        packages.push({
          name: pkgName,
          path: forceUnixPath(pkgCodeFolder),
          adrFolder: forceUnixPath(pkgAdrFolder)
        });
        oneMorePackage = await this.console.askYesNoQuestion(
          `We are done with package #${packageNumber}. Do you want to add another one?`,
          false
        );
        packageNumber += 1;
      } while (oneMorePackage);
    }

    return {
      project: {
        name,
        tz: moment.tz.guess(),
        adrFolder: forceUnixPath(adrFolder),
        packages
      }
    };
  }

  private async createAdr(
    cwd: string,
    adrFolder: string,
    title: string,
    source: string,
    replacements: [string, string][] = []
  ): Promise<string> {
    const slug = (
      await execa(
        "log4brains",
        [
          "adr",
          "new",
          "--quiet",
          "--from",
          forceUnixPath(path.join(assetsPath, source)),
          `"${title}"`
        ],
        { cwd }
      )
    ).stdout;

    await replaceAllInFile(
      forceUnixPath(path.join(cwd, adrFolder, `${slug}.md`)),
      [
        ["{DATE_YESTERDAY}", moment().subtract(1, "days").format("YYYY-MM-DD")], // we use yesterday's date so that we are sure new ADRs will appear on top
        ...replacements
      ]
    );

    return slug;
  }

  private async copyFileIfAbsent(
    cwd: string,
    adrFolder: string,
    filename: string,
    contentCb?: (content: string) => string
  ): Promise<void> {
    const outPath = path.join(cwd, adrFolder, filename);
    if (!fs.existsSync(outPath)) {
      let content = await fsP.readFile(
        path.join(assetsPath, filename),
        "utf-8"
      );
      if (contentCb) {
        content = contentCb(content);
      }
      await fsP.writeFile(outPath, content);
    }
  }

  private printSuccess(): void {
    this.console.success("Log4brains is configured! 🎉🎉🎉");
    this.console.println();
    this.console.println("You can now use the CLI to create a new ADR:");
    this.console.println(`  ${chalk.cyan(`log4brains adr new`)}`);
    this.console.println("");
    this.console.println(
      "And start the web UI to preview your architecture knowledge base:"
    );
    this.console.println(`  ${chalk.cyan(`log4brains preview`)}`);
    this.console.println();
    this.console.println(
      "Do not forget to set up your CI/CD to automatically publish your knowledge base"
    );
    this.console.println(
      `Check out the ${terminalLink(
        "documentation",
        docLink
      )} to see some examples`
    );
  }

  private async askPathWhileNotFound(
    question: string,
    cwd: string,
    defaultValue?: string
  ): Promise<string> {
    const p = await this.console.askInputQuestion(question, defaultValue);
    if (!p.trim() || !fs.existsSync(path.join(cwd, p))) {
      this.console.warn("This path does not exist. Please try again...");
      return this.askPathWhileNotFound(question, cwd, defaultValue);
    }
    return p;
  }

  /**
   * Command flow.
   *
   * @param options
   * @param customCwd
   */
  async execute(options: InitCommandOpts, customCwd?: string): Promise<void> {
    const noInteraction = options.defaults;

    const cwd = customCwd ? path.resolve(customCwd) : process.cwd();
    if (!fs.existsSync(cwd)) {
      this.console.fatal(`The given path does not exist: ${chalk.cyan(cwd)}`);
      throw new FailureExit();
    }

    // Terminate now if already configured
    if (fs.existsSync(path.join(cwd, ".log4brains.yml"))) {
      this.console.warn(`${chalk.bold(".log4brains.yml")} already exists`);
      this.console.warn(
        "Please delete it and re-run this command if you want to configure it again"
      );
      this.console.println();
      this.printSuccess();
      return;
    }

    // Create .log4brains.yml interactively
    const config = await this.buildLog4brainsConfigInteractively(
      cwd,
      noInteraction
    );

    this.console.startSpinner("Writing config file...");
    const { adrFolder } = config.project;
    await fsP.writeFile(
      path.join(cwd, ".log4brains.yml"),
      yaml.stringify(config),
      "utf-8"
    );

    // Copy template, index and README if not already created
    this.console.updateSpinner("Copying template files...");
    await this.copyFileIfAbsent(cwd, adrFolder, "template.md");
    await this.copyFileIfAbsent(cwd, adrFolder, "index.md", (content) =>
      content.replace(/{PROJECT_NAME}/g, config.project.name)
    );
    await this.copyFileIfAbsent(cwd, adrFolder, "README.md");

    // List existing ADRs
    this.console.updateSpinner("Creating your first ADRs...");
    const adrListRes = await execa("log4brains", ["adr", "list", "--raw"], {
      cwd
    });

    // Create Log4brains ADR
    const l4bAdrSlug = await this.createAdr(
      cwd,
      adrFolder,
      "Use Log4brains to manage the ADRs",
      "use-log4brains-to-manage-the-adrs.md"
    );

    // Create MADR ADR if there was no ADR in the repository
    if (!adrListRes.stdout) {
      await this.createAdr(
        cwd,
        adrFolder,
        "Use Markdown Architectural Decision Records",
        "use-markdown-architectural-decision-records.md",
        [["{LOG4BRAINS_ADR_SLUG}", l4bAdrSlug]]
      );
    }

    // End
    this.console.stopSpinner();
    this.printSuccess();
  }
}

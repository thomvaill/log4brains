/* eslint-disable no-await-in-loop */
/* eslint-disable class-methods-use-this */
import fs, { promises as fsP } from "fs";
import terminalLink from "terminal-link";
import chalk from "chalk";
import hasYarn from "has-yarn";
import execa from "execa";
import mkdirp from "mkdirp";
import yaml from "yaml";
import path from "path";
import editJsonFile from "edit-json-file";
import { Console } from "../console";
import { FailureExit } from "./FailureExit";

const docLink = "https://github.com/log4brains/log4brains";

type Deps = {
  appConsole: Console;
};

export class InitCommand {
  private readonly console: Console;

  private hasYarnValue?: boolean;

  constructor({ appConsole }: Deps) {
    this.console = appConsole;
  }

  private hasYarn(): boolean {
    if (!this.hasYarnValue) {
      this.hasYarnValue = hasYarn() || this.isDev();
    }
    return this.hasYarnValue;
  }

  private isDev(): boolean {
    return process.env.NODE_ENV === "development";
  }

  private async installNpmPackages(): Promise<void> {
    const packages = ["@log4brains/cli", "@log4brains/web"];

    if (this.isDev()) {
      await execa("yarn", ["link", ...packages]);

      // ... but unfortunately `yarn link` does not create the bin symlinks (https://github.com/yarnpkg/yarn/issues/5713)
      // we have to do it ourselves:
      await mkdirp("node_modules/.bin");
      await execa("ln", [
        "-s",
        "--force",
        "../@log4brains/cli/dist/log4brains",
        "node_modules/.bin/log4brains"
      ]);
      await execa("ln", [
        "-s",
        "--force",
        "../@log4brains/web/dist/bin/log4brains-web",
        "node_modules/.bin/log4brains-web"
      ]);
    } else if (this.hasYarn()) {
      await execa("yarn", [
        "add",
        "--dev",
        "--ignore-workspace-root-check",
        ...packages
      ]);
    } else {
      await execa("npm", ["install", "--save-dev", ...packages]);
    }
  }

  private guessMainAdrFolderPath(): string | undefined {
    const usualPaths = [
      "docs/adr",
      "docs/adrs",
      "docs/architecture-decisions",
      "doc/adr",
      "doc/adrs",
      "doc/architecture-decisions",
      "adr",
      "adrs",
      "architecture-decisions"
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const possiblePath of usualPaths) {
      if (fs.existsSync(possiblePath)) {
        return possiblePath;
      }
    }
    return undefined;
  }

  private printSuccess(): void {
    const runCmd = this.hasYarn() ? "yarn" : "npm run";
    const l4bCliCmdName = "adr";

    this.console.success("Log4brains is installed and configured! 🎉🎉🎉");
    this.console.print();
    this.console.print("You can now use the CLI to create a new ADR:");
    this.console.print(`  ${chalk.cyan(`${runCmd} ${l4bCliCmdName} new`)}`);
    this.console.print("");
    this.console.print(
      "And start the web UI to preview your architecture knowledge base:"
    );
    this.console.print(`  ${chalk.cyan(`${runCmd} log4brains-preview`)}`);
    this.console.print();
    this.console.print(
      `Do not forget to check the ${terminalLink(
        "documentation",
        docLink
      )} to learn how to set up your CI/CD to publish it`
    );
  }

  private async askPathWhileNotFound(question: string): Promise<string> {
    const p = await this.console.askInputQuestion(question);
    if (!fs.existsSync(p)) {
      this.console.warn("This path does not exist. Please try again...");
      return this.askPathWhileNotFound(question);
    }
    return p;
  }

  async execute(): Promise<void> {
    // Check package.json existence
    if (!fs.existsSync("package.json")) {
      this.console.fatal(`Impossible to find ${chalk.cyan("package.json")}`);
      this.console.print(
        "Are you sure to execute the command inside your project root directory?"
      );
      this.console.print(
        `Please refer to the ${terminalLink(
          "documentation",
          docLink
        )} if you want to use Log4brains in a non-JS project or globally`
      );
      throw new FailureExit();
    }

    // Install NPM packages
    this.console.startSpinner("Installing Log4brains CLI & web packages");
    await this.installNpmPackages();
    this.console.stopSpinnerSuccess("Log4brains CLI & web packages installed");

    // Set scripts
    const pkgJson = editJsonFile("package.json");
    pkgJson.set("scripts.adr", "log4brains adr");
    pkgJson.set("scripts.log4brains-preview", "log4brains-web preview");
    pkgJson.set("scripts.log4brains-build", "log4brains-web build");
    pkgJson.save();
    this.console.print(
      `We have added the following scripts to your ${chalk.cyan(
        "package.json"
      )}: adr, log4brains-preview, log4brains-build`
    );
    this.console.print();

    // Terminate now if already configured
    if (fs.existsSync(".log4brains.yml")) {
      this.console.info(
        `${chalk.cyan(".log4brains.yml")} is already created. We stop there!`
      );
      this.printSuccess();
      return;
    }

    // Create .log4brains.yml interactively
    // Name
    let name;
    try {
      name = require(path.join(process.cwd(), "package.json")).name as string;
      if (!name) {
        throw Error("Empty name");
      }
    } catch (e) {
      this.console.warn(
        `Impossible to get the project name from your ${chalk.cyan(
          "package.json"
        )}`
      );
    }
    name = await this.console.askInputQuestion(
      "What is the name of your project?",
      name
    );

    // Project type
    const type = await this.console.askListQuestion(
      "Which statement describes the best your project?",
      [
        {
          name: "Simple project (only one ADR folder)",
          value: "mono",
          short: "Mono-package project"
        },
        {
          name:
            "Multi-packages project (a main ADR folder for global ones + an ADR folder per package for specific ones)",
          value: "multi",
          short: "Multi-package project"
        }
      ]
    );

    // Main ADR folder location
    let adrFolder = this.guessMainAdrFolderPath();
    if (adrFolder) {
      this.console.info(
        `We have detected a possible existing ADR folder: ${chalk.cyan(
          adrFolder
        )}`
      );
      adrFolder = (await this.console.askYesNoQuestion("Do you confirm?", true))
        ? adrFolder
        : undefined;
    }
    if (!adrFolder) {
      adrFolder = await this.console.askInputQuestion(
        `In which directory do you plan to store your ${
          type === "multi" ? "global " : ""
        }ADRs? (will be automatically created)`,
        "docs/adr"
      );
    }
    await mkdirp(adrFolder);
    this.console.print();

    // Packages
    const packages = [];
    if (type === "multi") {
      this.console.print("We will now define your packages...");
      this.console.print();

      let oneMorePackage = false;
      let packageNumber = 1;
      do {
        this.console.print();
        this.console.print(
          `  ${chalk.underline(`Package #${packageNumber}`)}:`
        );
        const pkgName = await this.console.askInputQuestion(
          "Name? (short, lowercase, without special characters, nor spaces)"
        );
        const pkgCodeFolder = await this.askPathWhileNotFound(
          "Where is located the source code of this package?"
        );
        const pkgAdrFolder = await this.console.askInputQuestion(
          `In which directory do you plan to store the ADRs of this package? (will be automatically created)`,
          `${pkgCodeFolder}/docs/adr`
        );
        await mkdirp(pkgAdrFolder);
        packages.push({
          name: pkgName,
          path: pkgCodeFolder,
          adrFolder: pkgAdrFolder
        });
        oneMorePackage = await this.console.askYesNoQuestion(
          `We are done for package #${packageNumber}. Do you want to add another one?`,
          false
        );
        packageNumber += 1;
      } while (oneMorePackage);
    }

    // Write config
    await fsP.writeFile(
      ".log4brains.yml",
      yaml.stringify({
        project: {
          name,
          adrFolder,
          packages
        }
      }),
      "utf-8"
    );

    // End
    this.printSuccess();
  }
}

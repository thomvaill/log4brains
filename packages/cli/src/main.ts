import fs from "fs";
import path from "path";
import terminalLink from "terminal-link";
import { Log4brains, Log4brainsError } from "@log4brains/core";
import { AppConsole } from "@log4brains/cli-common";
import { createCli } from "./cli";

const templateExampleUrl =
  "https://raw.githubusercontent.com/thomvaill/log4brains/master/packages/init/assets/template.md";

function findRootFolder(cwd: string): string {
  if (fs.existsSync(path.join(cwd, ".log4brains.yml"))) {
    return cwd;
  }
  if (path.resolve(cwd) === "/") {
    throw new Error("Impossible to find a .log4brains.yml configuration file");
  }
  return findRootFolder(path.join(cwd, ".."));
}

const debug = !!process.env.DEBUG;
const dev = process.env.NODE_ENV === "development";
const appConsole = new AppConsole({ debug, traces: debug || dev });

try {
  // eslint-disable-next-line
  const pkgVersion = require("../package.json").version as string;

  const l4bInstance = Log4brains.create(
    findRootFolder(process.env.LOG4BRAINS_CWD || ".")
  );

  const cli = createCli({ version: pkgVersion, l4bInstance, appConsole });
  cli.parseAsync(process.argv).catch((err) => {
    appConsole.fatal(err);

    if (
      err instanceof Log4brainsError &&
      err.name === "The template.md file does not exist"
    ) {
      appConsole.printlnErr(
        `You can use this ${terminalLink(
          "template",
          templateExampleUrl
        )} as an example`
      );
      appConsole.printlnErr();
    }

    process.exit(1);
  });
} catch (e) {
  appConsole.fatal(e);
  process.exit(1);
}

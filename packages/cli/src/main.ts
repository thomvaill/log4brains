import fs from "fs";
import path from "path";
import { Log4brains } from "@log4brains/core";
import { appConsole } from "./console";
import { createCli } from "./cli";

function findRootFolder(cwd: string): string {
  if (fs.existsSync(path.join(cwd, ".log4brains.yml"))) {
    return cwd;
  }
  if (path.resolve(cwd) === "/") {
    throw new Error("Impossible to find a .log4brains.yml configuration file");
  }
  return findRootFolder(path.join(cwd, ".."));
}

try {
  // eslint-disable-next-line
  const pkgVersion = require("../package.json").version as string;
  const l4bInstance = Log4brains.create(
    findRootFolder(process.env.LOG4BRAINS_CWD || ".")
  );

  const cli = createCli({ version: pkgVersion, l4bInstance, appConsole });
  cli.parseAsync(process.argv).catch((err) => {
    appConsole.fatal(err);
    process.exit(1);
  });
} catch (e) {
  appConsole.fatal(e);
  process.exit(1);
}

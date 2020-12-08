import { AppConsole } from "@log4brains/cli-common";
import { createCli } from "./cli";
import { FailureExit } from "./commands";

const debug = !!process.env.DEBUG;
const dev = process.env.NODE_ENV === "development";
const appConsole = new AppConsole({ debug, traces: debug || dev });

try {
  // eslint-disable-next-line
  const { name, version } = require("../package.json") as Record<
    string,
    string
  >;

  const cli = createCli({ name, version, appConsole });
  cli.parseAsync(process.argv).catch((err) => {
    if (!(err instanceof FailureExit)) {
      if (appConsole.isSpinning()) {
        appConsole.stopSpinner(true);
      }
      appConsole.fatal(err);
    }
    process.exit(1);
  });
} catch (e) {
  appConsole.fatal(e);
  process.exit(1);
}

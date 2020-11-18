import { appConsole } from "./console";
import { createCli } from "./cli";
import { FailureExit } from "./commands";

try {
  // eslint-disable-next-line
  const { name, version } = require("../package.json") as Record<
    string,
    string
  >;

  const cli = createCli({ name, version, appConsole });
  cli.parseAsync(process.argv).catch((err) => {
    if (appConsole.isSpinning()) {
      appConsole.stopSpinnerFailure();
    }

    if (!(err instanceof FailureExit)) {
      appConsole.fatal(err);
    }

    process.exit(1);
  });
} catch (e) {
  appConsole.fatal(e);
  process.exit(1);
}

import { AppConsole } from "@log4brains/cli-common";
import { createInitCli } from "../src/cli";

const cli = createInitCli({
  appConsole: new AppConsole({ debug: false, traces: false })
});
cli.parse(process.argv);

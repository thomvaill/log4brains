import commander from "commander";
import { previewCommand, buildCommand } from "../cli";
import { appConsole } from "../lib/console";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,global-require,@typescript-eslint/no-var-requires
const pkgVersion = require("../../package.json").version as string;

type StartEditorCommandOpts = {
  port: string;
  open: boolean;
};
type BuildCommandOpts = {
  out: string;
  basePath: string;
};

function createCli(version: string): commander.Command {
  const program = new commander.Command();
  program.version(version);

  // TODO: open browser automatically
  // TODO: add [file] argument to open browser directly to given ADR (used by the CLI). Do not start another process if already started.
  program
    .command("preview")
    .description("Start log4brains locally to preview your changes")
    .option("-p, --port <port>", "Port to listen on", "4004")
    .option("--no-open", "Do not open the browser automatically", false)
    .action(
      (opts: StartEditorCommandOpts): Promise<void> => {
        return previewCommand(parseInt(opts.port, 10), opts.open);
      }
    );

  program
    .command("build")
    .description("Build the deployable static website")
    .option("-o, --out <path>", "Output path", ".log4brains/out")
    .option("--basePath <path>", "Custom base path", "")
    .action(
      (opts: BuildCommandOpts): Promise<void> => {
        return buildCommand(opts.out, opts.basePath);
      }
    );

  return program;
}

const cli = createCli(pkgVersion);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
cli.parseAsync(process.argv).catch((err) => {
  if (appConsole.isSpinning()) {
    appConsole.stopSpinner(true);
  }
  appConsole.fatal(err);
  process.exit(1);
});

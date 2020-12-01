import commander from "commander";
import { previewCommand, buildCommand } from "../cli";
import { logger } from "../lib/logger";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,global-require,@typescript-eslint/no-var-requires
const pkgVersion = require("../../package.json").version as string;

type StartEditorCommandOpts = {
  port: string;
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
    .action(
      (opts: StartEditorCommandOpts): Promise<void> => {
        return previewCommand(parseInt(opts.port, 10));
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
  logger.fatal(err);
  process.exit(1);
});

import commander from "commander";
import type { AppConsole } from "@log4brains/cli-common";
import { previewCommand, buildCommand } from "./commands";

type StartEditorCommandOpts = {
  port: string;
  open: boolean;
};
type BuildCommandOpts = {
  out: string;
  basePath: string;
};

type Deps = {
  appConsole: AppConsole;
};

export function createWebCli({ appConsole }: Deps): commander.Command {
  const program = new commander.Command();

  program
    .command("preview [adr]")
    .description("Start Log4brains locally to preview your changes", {
      adr:
        "If provided, will automatically open your browser to this specific ADR"
    })
    .option("-p, --port <port>", "Port to listen on", "4004")
    .option("--no-open", "Do not open the browser automatically", false)
    .action(
      (adr: string, opts: StartEditorCommandOpts): Promise<void> => {
        return previewCommand(
          { appConsole },
          parseInt(opts.port, 10),
          opts.open,
          adr
        );
      }
    );

  program
    .command("build")
    .description("Build Log4brains as a deployable static website")
    .option("-o, --out <path>", "Output path", ".log4brains/out")
    .option("--basePath <path>", "Custom base path", "")
    .action(
      (opts: BuildCommandOpts): Promise<void> => {
        return buildCommand({ appConsole }, opts.out, opts.basePath);
      }
    );

  return program;
}

import commander from "commander";
import type { AppConsole } from "@log4brains/cli-common";
import { InitCommand, InitCommandOpts } from "./commands";

type Deps = {
  appConsole: AppConsole;
};

export function createInitCli({ appConsole }: Deps): commander.Command {
  const program = new commander.Command();

  program
    .command("init")
    .arguments("[path]")
    .description("Configures Log4brains for your project", {
      path: "Path of your project. Default: current directory"
    })
    .option(
      "-d, --defaults",
      "Run in non-interactive mode and use the common default options",
      false
    )
    .action(
      (path: string | undefined, options: InitCommandOpts): Promise<void> => {
        return new InitCommand({ appConsole }).execute(options, path);
      }
    );

  return program;
}

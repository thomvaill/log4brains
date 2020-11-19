import commander from "commander";
import { InitCommand, InitCommandOpts } from "./commands";
import { Console } from "./console";

type Deps = {
  appConsole: Console;
  version: string;
  name: string;
};

export function createCli({
  appConsole,
  name,
  version
}: Deps): commander.Command {
  return new commander.Command(name)
    .version(version)
    .arguments("[path]")
    .description("Installs and configures Log4brains for your project", {
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
}

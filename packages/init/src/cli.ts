import commander from "commander";
import { InitCommand } from "./commands";
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
    .action(
      (path?: string): Promise<void> => {
        return new InitCommand({ appConsole }).execute(path);
      }
    );
}

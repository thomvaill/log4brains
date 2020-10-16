import commander from "commander";
import { Log4brains } from "@log4brains/core";
import { Console } from "./console";
import { ListCommand, ListCommandOpts, NewCommand } from "./commands";

type Deps = {
  l4bInstance: Log4brains;
  appConsole: Console;
  version: string;
};

export function createCli({
  l4bInstance,
  appConsole,
  version
}: Deps): commander.Command {
  const program = new commander.Command();
  program.version(version);

  const adr = program
    .command("adr")
    .description("Manage the Architecture Decision Records (ADR)");

  adr
    .command("new")
    .description("Create an ADR")
    .action(
      (): Promise<void> => {
        return new NewCommand({ l4bInstance, appConsole }).execute();
      }
    );

  // adr
  //   .command("quick")
  //   .description("Create a one-sentence ADR (Y-Statement)")
  //   .action(
  //     (): Promise<void> => {
  //       // TODO
  //     }
  //   );

  adr
    .command("list")
    .option(
      "-s, --statuses <statuses>",
      "Filter on the given statuses, comma-separated"
    ) // TODO: list available statuses
    .description("List ADRs")
    .action(
      (opts: ListCommandOpts): Promise<void> => {
        return new ListCommand({ l4bInstance, appConsole }).execute(opts);
      }
    );

  return program;
}

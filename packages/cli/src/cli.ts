import commander from "commander";
import terminalLink from "terminal-link";
import { Log4brains, Log4brainsError } from "@log4brains/core";
import { AppConsole, FailureExit } from "@log4brains/cli-common";

import {
  ListCommand,
  ListCommandOpts,
  NewCommand,
  NewCommandOpts
} from "./commands";

const templateExampleUrl =
  "https://raw.githubusercontent.com/thomvaill/log4brains/stable/packages/init/assets/template.md";

let l4bInstance: Log4brains;
function getL4bInstance(): Log4brains {
  if (!l4bInstance) {
    l4bInstance = Log4brains.createFromCwd(process.env.LOG4BRAINS_CWD || ".");
  }
  return l4bInstance;
}

function execWithErrorHandler<T>(
  promise: Promise<T>,
  appConsole: AppConsole
): Promise<T> {
  promise.catch((err) => {
    if (
      err instanceof Log4brainsError &&
      err.name === "The template.md file does not exist"
    ) {
      appConsole.error(err);
      appConsole.printlnErr(
        `You can use this ${terminalLink(
          "template",
          templateExampleUrl
        )} as an example`
      );
      throw new FailureExit();
    }
  });
  return promise;
}

type Deps = {
  appConsole: AppConsole;
};

export function createCli({ appConsole }: Deps): commander.Command {
  const program = new commander.Command();

  const adr = program
    .command("adr")
    .description("Group of commands to manage your ADRs...");

  adr
    .command("new [title]")
    .description("Create an ADR", {
      title: "The title of the ADR. Required if --quiet is passed"
    })
    .option("-q, --quiet", "Disable interactive mode", false)
    .option(
      "-p, --package <package>",
      "To create the ADR for a specific package"
    )
    .option(
      "--from <file>",
      "Copy <file> contents into the ADR instead of using the default template"
    )
    .action(
      (title: string | undefined, opts: NewCommandOpts): Promise<void> => {
        const cmd = new NewCommand({
          l4bInstance: getL4bInstance(),
          appConsole
        });
        return execWithErrorHandler(cmd.execute(opts, title), appConsole);
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
    .option("-r, --raw", "Use a raw format instead of a table", false)
    .description("List ADRs")
    .action(
      (opts: ListCommandOpts): Promise<void> => {
        const cmd = new ListCommand({
          l4bInstance: getL4bInstance(),
          appConsole
        });
        return execWithErrorHandler(cmd.execute(opts), appConsole);
      }
    );

  return program;
}

/* eslint-disable no-console */
import chalk from "chalk";
import { AppConsole } from "../src/AppConsole";

function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

async function t(name: string, cb: () => void | Promise<void>): Promise<void> {
  console.log(chalk.dim(`*** TEST: ${name}`));
  await cb();
  console.log(chalk.dim(`*** END`));
  console.log();
}

/**
 * Visual tests for AppConsole
 */
void (async () => {
  await t("print()", () => {
    const appConsole = new AppConsole();
    appConsole.println("Line 1");
    appConsole.println("Line 2");
    appConsole.println();
    appConsole.println("Line 3 with new line");
  });

  await t("debug() off", () => {
    const appConsole = new AppConsole();
    appConsole.debug("This should not be printed");
  });

  await t("debug() on", () => {
    const appConsole = new AppConsole({ debug: true });
    appConsole.debug("Line 1");
    appConsole.debug("Line 2");
  });

  await t("warn() with message", () => {
    const appConsole = new AppConsole();
    appConsole.warn("This is a warning");
    appConsole.warn("This is a warning line2");
  });

  await t("warn() with Error", () => {
    const appConsole = new AppConsole();
    appConsole.warn(new Error("The message or the generic error"));
    appConsole.warn(new RangeError("The message or the RangeError"));
  });

  await t("warn() with Error and traces on", () => {
    const appConsole = new AppConsole({ traces: true });
    appConsole.warn(new Error("The message or the generic error"));
    appConsole.warn(new RangeError("The message or the RangeError"));
  });

  await t("error() with message", () => {
    const appConsole = new AppConsole();
    appConsole.error("This is an error");
    appConsole.error("This is an error line2");
  });

  await t("error() with Error", () => {
    const appConsole = new AppConsole();
    appConsole.error(new Error("The message or the generic error"));
    appConsole.error(new RangeError("The message or the RangeError"));
  });

  await t("error() with Error and traces on", () => {
    const appConsole = new AppConsole({ traces: true });
    appConsole.error(new Error("The message or the generic error"));
    appConsole.error(new RangeError("The message or the RangeError"));
  });

  await t("fatal() with message", () => {
    const appConsole = new AppConsole();
    appConsole.fatal("This is an error");
    appConsole.fatal("This is an error line2");
  });

  await t("fatal() with Error", () => {
    const appConsole = new AppConsole();
    appConsole.fatal(new Error("The message or the generic error"));
    appConsole.fatal(new RangeError("The message or the RangeError"));
  });

  await t("fatal() with Error and traces on", () => {
    const appConsole = new AppConsole({ traces: true });
    appConsole.fatal(new Error("The message or the generic error"));
    appConsole.fatal(new RangeError("The message or the RangeError"));
  });

  await t("success()", () => {
    const appConsole = new AppConsole();
    appConsole.success("Yeah! This is a success!");
  });

  await t("table", () => {
    const appConsole = new AppConsole();
    const table = appConsole.createTable({ head: ["Col 1", "Col 2"] });
    table.push(["Cell 1.1", "Cell 1.2"]);
    table.push(["Cell 2.1", "Cell 2.2"]);
    appConsole.printTable(table);
    appConsole.printTable(table, true);
  });

  await t("askYesNoQuestion()", async () => {
    const appConsole = new AppConsole();
    await appConsole.askYesNoQuestion("Do you like this script?", true);
  });

  await t("askInputQuestion()", async () => {
    const appConsole = new AppConsole();
    await appConsole.askInputQuestion(
      "Please enter something",
      "default value"
    );
  });

  await t("askListQuestion()", async () => {
    const appConsole = new AppConsole();
    await appConsole.askListQuestion("Please select something", [
      { name: "Option 1", value: "opt1", short: "O1" },
      { name: "Option 2", value: "opt2", short: "O2" }
    ]);
  });

  await t("spinner", async () => {
    const appConsole = new AppConsole();
    appConsole.startSpinner("The spinner is spinning...");
    await sleep(5);
    appConsole.stopSpinner();
    appConsole.success("This is a success!");
  });
})();

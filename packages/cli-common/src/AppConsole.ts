/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import chalk from "chalk";
import inquirer from "inquirer";
import ora, { Ora } from "ora";
import CliTable3, { Table } from "cli-table3";
import { ConsoleCapturer } from "./ConsoleCapturer";

export type AppConsoleOptions = {
  debug: boolean;
  traces: boolean;
};

export type ChoiceDefinition<V extends string> = {
  name: string;
  value: V;
  short?: string;
};

export class AppConsole {
  private readonly opts: AppConsoleOptions;

  private spinner?: Ora;

  private spinnerConsoleCapturer = new ConsoleCapturer();

  constructor(opts: Partial<AppConsoleOptions> = {}) {
    this.opts = {
      debug: false,
      traces: false,
      ...opts
    };
  }

  isSpinning(): boolean {
    return !!this.spinner;
  }

  startSpinner(message: string): void {
    if (this.spinner) {
      throw new Error("Spinner already started");
    }
    this.spinner = ora({
      text: message,
      spinner: "bouncingBar",
      stream: process.stdout
    }).start();

    // Add capturing of console.log/warn/error to allow pausing
    // the spinner before logging and then restarting spinner after
    this.spinnerConsoleCapturer.onLog = (method, args) => {
      this.spinner?.stop();
      method(...args);
      this.spinner?.start();
    };
    this.spinnerConsoleCapturer.start();
  }

  updateSpinner(message: string): void {
    if (!this.spinner) {
      throw new Error("Spinner is not started");
    }
    this.spinner.text = message;
  }

  stopSpinner(withError = false): void {
    if (!this.spinner) {
      throw new Error("Spinner is not started");
    }

    this.spinnerConsoleCapturer.stop();

    this.spinner.stopAndPersist({
      symbol: chalk.dim(withError ? "[==  ]" : "[====]"),
      text: `${this.spinner.text} ${withError ? chalk.red("Error") : "Done"}`
    });
    this.println();
    this.spinner = undefined;
  }

  println(message?: any, ...optionalParams: any[]): void {
    console.log(message ?? "", ...optionalParams);
  }

  printlnErr(message?: any, ...optionalParams: any[]): void {
    console.error(message ?? "", ...optionalParams);
  }

  debug(message?: any, ...optionalParams: any[]): void {
    if (this.opts.debug) {
      this.println(
        chalk.dim(message),
        ...optionalParams.map((p) => chalk.dim(p))
      );
    }
  }

  warn(messageOrErr: string | Error): void {
    if (messageOrErr instanceof Error) {
      this.printlnErr(chalk.yellowBright(` ⚠  ${messageOrErr.message}`));
      if (this.opts.traces && messageOrErr.stack) {
        this.printlnErr(chalk.yellow(messageOrErr.stack));
        this.printlnErr();
      }
    } else {
      this.printlnErr(chalk.yellowBright(` ⚠  ${messageOrErr}`));
    }
  }

  error(messageOrErr: string | Error): void {
    if (messageOrErr instanceof Error) {
      this.printlnErr(chalk.redBright(` ✖  ${messageOrErr.message}`));
      if (this.opts.traces && messageOrErr.stack) {
        this.printlnErr(chalk.red(messageOrErr.stack));
        this.printlnErr();
      }
    } else {
      this.printlnErr(chalk.redBright(` ✖  ${messageOrErr}`));
    }
  }

  fatal(messageOrErr: string | Error): void {
    this.printlnErr();
    if (messageOrErr instanceof Error) {
      this.printlnErr(
        `${chalk.bgRed.bold(" FATAL ")} ${chalk.redBright(
          messageOrErr.message
        )}`
      );
      if (this.opts.traces && messageOrErr.stack) {
        this.printlnErr();
        this.printlnErr(chalk.red(messageOrErr.stack));
      }
    } else {
      this.printlnErr(
        `${chalk.bgRed.bold(" FATAL ")} ${chalk.redBright(messageOrErr)}`
      );
    }
    this.printlnErr();
  }

  success(message: string): void {
    this.println(chalk.greenBright(` ✔  ${message}`));
  }

  createTable(options?: CliTable3.TableConstructorOptions): Table {
    return new CliTable3({
      style: {
        head: ["blue"]
      },
      ...options
    });
  }

  printTable(table: Table, raw = false): void {
    if (raw) {
      table.forEach((value) => {
        if (typeof value === "object" && value instanceof Array) {
          console.log(value.join(","));
        } else {
          console.log(value);
        }
      });
    } else {
      console.log(table.toString());
    }
  }

  async askYesNoQuestion(
    question: string,
    defaultValue: boolean
  ): Promise<boolean> {
    console.log("");
    const answer = await inquirer.prompt<{ q: boolean }>([
      { type: "confirm", name: "q", message: question, default: defaultValue }
    ]);
    return answer.q;
  }

  async askInputQuestion(
    question: string,
    defaultValue?: string
  ): Promise<string> {
    console.log("");
    const answer = await inquirer.prompt<{ q: string }>([
      {
        type: "input",
        name: "q",
        message: question,
        default: defaultValue
      }
    ]);
    return answer.q;
  }

  async askInputQuestionAndValidate(
    question: string,
    validationCb: (answer: string) => boolean | string,
    defaultValue?: string
  ): Promise<string> {
    let answer: string;
    let valid: boolean | string = true;
    let i = 0;
    do {
      if (valid !== true) {
        console.log(
          chalk.red(
            `✗ Please enter a correct value${
              valid === false ? "" : `: ${valid}`
            }`
          )
        );
      }
      if (i >= 10) {
        throw new Error("Reached maximum number of retries (10)");
      }

      // eslint-disable-next-line no-await-in-loop
      answer = await this.askInputQuestion(question, defaultValue);
      valid = validationCb(answer);
      i += 1;
    } while (valid !== true);
    return answer;
  }

  async askListQuestion<V extends string>(
    question: string,
    choices: ChoiceDefinition<V>[],
    defaultValue?: V
  ): Promise<V> {
    console.log("");
    const answer = await inquirer.prompt<{ q: V }>([
      {
        type: "list",
        name: "q",
        message: question,
        default: defaultValue,
        choices
      }
    ]);
    return answer.q;
  }
}

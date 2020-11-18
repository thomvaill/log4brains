/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import signale from "signale";
import inquirer from "inquirer";
import ora, { Ora } from "ora";

// TODO: move into core
export interface Logger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string | Error): void;
  error(message: string | Error): void;
  fatal(message: string | Error): void;
}

type ChoiceDefinition<V extends string> = {
  name: string;
  value: V;
  short?: string;
};

const transformMessage = (message: string | Error): string | Error => {
  if (process.env.NODE_ENV !== "development" && message instanceof Error) {
    return message.message;
  }
  return message;
};

// TODO: same class as in CLI package?
export class Console implements Logger {
  private spinner?: Ora;

  isSpinning(): boolean {
    return !!this.spinner;
  }

  startSpinner(message: string): void {
    if (this.spinner) {
      throw new Error("Spinner already started");
    }
    this.spinner = ora(message).start();
  }

  stopSpinnerSuccess(message?: string): void {
    if (!this.spinner) {
      throw new Error("Spinner is not started");
    }
    this.spinner.succeed(message);
    this.spinner = undefined;
  }

  stopSpinnerFailure(message?: string): void {
    if (!this.spinner) {
      throw new Error("Spinner is not started");
    }
    this.spinner.fail(message);
    this.spinner = undefined;
  }

  debug(message: string): void {
    signale.debug(message);
  }

  info(message: string): void {
    signale.info(message);
  }

  warn(message: string | Error): void {
    signale.warn(transformMessage(message));
  }

  error(message: string | Error): void {
    signale.error(transformMessage(message));
  }

  fatal(message: string | Error): void {
    signale.fatal(transformMessage(message));
  }

  print(message?: string): void {
    console.log(message ?? "");
  }

  success(message: string): void {
    this.print(`✔ ${message}`);
  }

  async askYesNoQuestion(
    question: string,
    defaultValue: boolean
  ): Promise<boolean> {
    const answer = await inquirer.prompt<{ q: boolean }>([
      { type: "confirm", name: "q", message: question, default: defaultValue }
    ]);
    return answer.q;
  }

  async askInputQuestion(
    question: string,
    defaultValue?: string
  ): Promise<string> {
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

  async askListQuestion<V extends string>(
    question: string,
    choices: ChoiceDefinition<V>[],
    defaultValue?: V
  ): Promise<V> {
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

export const appConsole = new Console();

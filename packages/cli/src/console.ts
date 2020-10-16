/* eslint-disable no-console */
import signale from "signale";
import inquirer from "inquirer";
import { Table } from "cli-table3";

// TODO: move into core
export interface Logger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  fatal(message: string): void;
}

type ChoiceDefinition<V extends string> = {
  name: string;
  value: V;
  short?: string;
};

export interface Console extends Logger {
  success(message: string): void;
  table(table: Table): void;
  askYesNoQuestion(question: string, defaultValue: boolean): Promise<boolean>;
  askInputQuestion(question: string, defaultValue?: string): Promise<string>;
  askListQuestion<V extends string>(
    question: string,
    choices: ChoiceDefinition<V>[],
    defaultValue?: V
  ): Promise<V>;
}

function createConsole(): Console {
  return {
    debug: (message: string): void => {
      signale.debug(message);
    },
    info: (message: string): void => {
      signale.info(message);
    },
    warn: (message: string): void => {
      signale.warn(message);
    },
    error: (message: string): void => {
      signale.error(message);
    },
    fatal: (message: string): void => {
      signale.fatal(message);
    },

    success: (message: string): void => {
      signale.success(message);
    },

    table: (table: Table): void => {
      console.log(table.toString());
    },

    askYesNoQuestion: async (
      question: string,
      defaultValue: boolean
    ): Promise<boolean> => {
      const answer = await inquirer.prompt<{ q: boolean }>([
        { type: "confirm", name: "q", message: question, default: defaultValue }
      ]);
      return answer.q;
    },

    askInputQuestion: async (
      question: string,
      defaultValue?: string
    ): Promise<string> => {
      const answer = await inquirer.prompt<{ q: string }>([
        {
          type: "input",
          name: "q",
          message: question,
          default: defaultValue
        }
      ]);
      return answer.q;
    },

    askListQuestion: async <V extends string>(
      question: string,
      choices: ChoiceDefinition<V>[],
      defaultValue?: V
    ): Promise<V> => {
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
  };
}

export const appConsole = createConsole();

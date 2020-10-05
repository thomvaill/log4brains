/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import signale from "signale";

export interface Logger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  fatal(message: string): void;
}

function createLogger(): Logger {
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
    }
  };
}

export const logger = createLogger();

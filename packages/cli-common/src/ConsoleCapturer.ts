/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

export type ConsoleLogMethod = typeof console.log;
export type ConsoleWarnMethod = typeof console.warn;
export type ConsoleErrorMethod = typeof console.error;
export type ConsoleMethod =
  | ConsoleLogMethod
  | ConsoleWarnMethod
  | ConsoleErrorMethod;

/**
 * Captures console.log(), console.error() and console.warn()
 * Source: https://github.com/vercel/next.js/blob/canary/packages/next/build/spinner.ts Thanks!
 */
export class ConsoleCapturer {
  private origConsoleLog?: ConsoleLogMethod;

  private origConsoleWarn?: ConsoleWarnMethod;

  private origConsoleError?: ConsoleErrorMethod;

  onLog?: (
    method: ConsoleMethod,
    args: any[],
    stream: "stdout" | "stderr"
  ) => void;

  start(): void {
    this.origConsoleLog = console.log;
    this.origConsoleWarn = console.warn;
    this.origConsoleError = console.error;

    const logHandle = (method: ConsoleMethod, args: any[]) => {
      if (this.onLog) {
        this.onLog(
          method,
          args,
          method === this.origConsoleLog ? "stdout" : "stderr"
        );
      }
    };

    console.log = (...args: any) => logHandle(this.origConsoleLog!, args);
    console.warn = (...args: any) => logHandle(this.origConsoleWarn!, args);
    console.error = (...args: any) => logHandle(this.origConsoleError!, args);
  }

  doPrintln(message?: any, ...optionalParams: any[]): void {
    if (!this.origConsoleLog) {
      throw new Error("ConsoleCapturer is not started");
    }
    this.origConsoleLog(message ?? "", ...optionalParams);
  }

  doPrintlnErr(message?: any, ...optionalParams: any[]): void {
    if (!this.origConsoleError) {
      throw new Error("ConsoleCapturer is not started");
    }
    this.origConsoleError(message ?? "", ...optionalParams);
  }

  stop(): void {
    if (
      !this.origConsoleLog ||
      !this.origConsoleWarn ||
      !this.origConsoleError
    ) {
      throw new Error("ConsoleCapturer is not started");
    }

    console.log = this.origConsoleLog;
    console.warn = this.origConsoleWarn;
    console.error = this.origConsoleError;

    this.origConsoleLog = undefined;
    this.origConsoleWarn = undefined;
    this.origConsoleError = undefined;
  }
}

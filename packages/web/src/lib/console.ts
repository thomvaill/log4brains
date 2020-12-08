/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import chalk from "chalk";
import { AppConsole, ConsoleCapturer } from "@log4brains/cli-common";

const debug = !!process.env.DEBUG;
const dev = process.env.NODE_ENV === "development";

export const appConsole = new AppConsole({ debug, traces: debug || dev });

export async function execNext(fn: () => Promise<void>): Promise<void> {
  const capturer = new ConsoleCapturer();
  if (debug) {
    capturer.onLog = (method, args) => {
      capturer.doPrintln(...["[Next] ", ...args].map((a) => chalk.dim(a)));
    };
  }
  capturer.start();
  await fn();
  capturer.stop();
}

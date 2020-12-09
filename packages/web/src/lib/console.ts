/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import chalk from "chalk";
import { AppConsole, ConsoleCapturer } from "@log4brains/cli-common";

const debug = !!process.env.DEBUG;
const dev = process.env.NODE_ENV === "development";

export const appConsole = new AppConsole({ debug, traces: debug || dev });

/**
 * #NEXTJS-HACK
 * We want to hide the output of Next.js when we execute CLI commands.
 *
 * @param fn The code which calls Next.js methods for which we want to capture the output
 */
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

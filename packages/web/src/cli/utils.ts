import chalk from "chalk";
import { ConsoleCapturer } from "@log4brains/cli-common";

/**
 * #NEXTJS-HACK
 * We want to hide the output of Next.js when we execute CLI commands.
 *
 * @param fn The code which calls Next.js methods for which we want to capture the output
 */
export async function execNext(fn: () => Promise<void>): Promise<void> {
  const debug = !!process.env.DEBUG;

  const capturer = new ConsoleCapturer();
  capturer.onLog = (method, args, stream) => {
    if (stream === "stderr" || debug) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      capturer.doPrintln(...["[Next] ", ...args].map((a) => chalk.dim(a)));
    }
  };

  capturer.start();
  await fn();
  capturer.stop();
}

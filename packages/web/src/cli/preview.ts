import next from "next";
import { createServer } from "http";
import SocketIO from "socket.io";
import chalk from "chalk";
import { getLog4brainsInstance } from "../lib/core-api";
import { getNextJsDir } from "../lib/next";
import { logger } from "../lib/logger";

export async function previewCommand(port: number): Promise<void> {
  process.env.NEXT_TELEMETRY_DISABLED = "1";
  logger.info("🧠 Log4brains is starting...");

  const app = next({
    dev: process.env.NODE_ENV === "development",
    dir: getNextJsDir()
  });

  /**
   * Ugly hack of Next.JS.
   * We override this private property to set the incrementalCache in "dev" mode (ie. it disables it)
   * to make our Hot Reload feature work.
   * In fact, we trigger a page re-render every time an ADR changes and we absolutely need up-to-date data on every render.
   * The "serve stale data while revalidating" Next.JS policy is not suitable for us.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.incrementalCache.incrementalOptions.dev = true; // eslint-disable-line @typescript-eslint/no-unsafe-member-access

  await app.prepare();

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const srv = createServer(app.getRequestHandler());

  // FileWatcher with Socket.io
  const io = SocketIO(srv);

  const { fileWatcher } = getLog4brainsInstance();
  getLog4brainsInstance().fileWatcher.subscribe((event) => {
    logger.debug(`[FileWatcher] ${event.type} - ${event.relativePath}`);
    io.emit("FileWatcher", event);
  });
  fileWatcher.start();

  try {
    await new Promise((resolve, reject) => {
      // This code catches EADDRINUSE error if the port is already in use
      srv.on("error", reject);
      srv.on("listening", () => resolve());
      srv.listen(port);
    });

    logger.info(
      `Your Log4brains preview is now 🚀 on ${chalk.underline.blueBright(
        `http://localhost:${port}/`
      )}`
    );
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.code === "EADDRINUSE") {
      logger.fatal(
        `Port ${port} is already in use. Use the -p <PORT> option to select another one.`
      );
      process.exit(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (err.code === "EACCES") {
      logger.fatal(
        `Impossible to use port ${port} (permission denied). Use the -p <PORT> option to select another one.`
      );
      process.exit(1);
    } else {
      throw err;
    }
  }
}

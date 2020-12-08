import next from "next";
import { createServer } from "http";
import SocketIO from "socket.io";
import chalk from "chalk";
import open from "open";
import { getLog4brainsInstance } from "../lib/core-api";
import { getNextJsDir } from "../lib/next";
import { appConsole, execNext } from "../lib/console";

export async function previewCommand(
  port: number,
  openBrowser: boolean,
  adrSlug?: string
): Promise<void> {
  process.env.NEXT_TELEMETRY_DISABLED = "1";
  const dev = process.env.NODE_ENV === "development";

  appConsole.startSpinner("Log4brains is starting...");
  appConsole.debug(`Run \`next ${dev ? "dev" : "start"}\`...`);

  const app = next({
    dev,
    dir: getNextJsDir()
  });

  /**
   * #NEXTJS-HACK
   * We override this private property to set the incrementalCache in "dev" mode (ie. it disables it)
   * to make our Hot Reload feature work.
   * In fact, we trigger a page re-render every time an ADR changes and we absolutely need up-to-date data on every render.
   * The "serve stale data while revalidating" Next.JS policy is not suitable for us.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.incrementalCache.incrementalOptions.dev = true; // eslint-disable-line @typescript-eslint/no-unsafe-member-access

  await execNext(async () => {
    await app.prepare();
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const srv = createServer(app.getRequestHandler());

  // FileWatcher with Socket.io
  const io = SocketIO(srv);

  const { fileWatcher } = getLog4brainsInstance();
  getLog4brainsInstance().fileWatcher.subscribe((event) => {
    appConsole.debug(`[FileWatcher] ${event.type} - ${event.relativePath}`);
    io.emit("FileWatcher", event);
  });
  fileWatcher.start();

  try {
    await execNext(
      () =>
        new Promise((resolve, reject) => {
          // This code catches EADDRINUSE error if the port is already in use
          srv.on("error", reject);
          srv.on("listening", () => resolve());
          srv.listen(port);
        })
    );
  } catch (err) {
    appConsole.stopSpinner();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.code === "EADDRINUSE") {
      if (openBrowser && adrSlug) {
        appConsole.println(
          chalk.dim(
            "Log4brains is already started. We open the browser and exit"
          )
        );
        await open(`http://localhost:${port}/adr/${adrSlug}`);
        process.exit(0);
      }

      appConsole.fatal(
        `Port ${port} is already in use. Use the -p <PORT> option to select another one.`
      );
      process.exit(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (err.code === "EACCES") {
      appConsole.fatal(
        `Impossible to use port ${port} (permission denied). Use the -p <PORT> option to select another one.`
      );
      process.exit(1);
    } else {
      throw err;
    }
  }

  appConsole.stopSpinner();
  appConsole.println(
    `Your Log4brains preview is 🚀 on ${chalk.underline.blueBright(
      `http://localhost:${port}/`
    )}`
  );
  appConsole.println(
    chalk.dim(
      "Hot Reload is enabled: any change you make to a markdown file is applied live"
    )
  );

  if (dev) {
    appConsole.println();
    appConsole.println(
      `${chalk.bgBlue.white.bold(" DEV ")} ${chalk.blue(
        "Next.js' Fast Refresh is enabled"
      )}`
    );
    appConsole.println();
  }

  if (openBrowser) {
    await open(`http://localhost:${port}/${adrSlug ? `adr/${adrSlug}` : ""}`);
  }
}

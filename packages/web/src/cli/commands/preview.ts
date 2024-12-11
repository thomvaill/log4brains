import next from "next";
import { createServer } from "http";
import SocketIO from "socket.io";
import chalk from "chalk";
import open from "open";
import type { AppConsole } from "@log4brains/cli-common";
import { getNextJsDir } from "../../lib/next";
import { execNext, getL4bInstance } from "../utils";

type Deps = {
  appConsole: AppConsole;
};

type SystemError = Error & { code?: string };
function isSystemError(obj: unknown): obj is SystemError {
  return obj instanceof Error && "code" in obj;
}

export async function previewCommand(
  { appConsole }: Deps,
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

  await execNext(async () => {
    await app.prepare();
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
  app.server.incrementalCache.incrementalOptions.dev = true; // eslint-disable-line @typescript-eslint/no-unsafe-member-access

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const srv = createServer(app.getRequestHandler());

  // FileWatcher with Socket.io
  const io = SocketIO(srv);

  const { fileWatcher } = getL4bInstance();
  fileWatcher.subscribe((event) => {
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

    if (isSystemError(err) && err.code === "EADDRINUSE") {
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
    } else if (isSystemError(err) && err.code === "EACCES") {
      appConsole.fatal(
        `Impossible to use port ${port} (permission denied). Use the -p <PORT> option to select another one.`
      );
      process.exit(1);
    }

    throw err;
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

import build from "next/dist/build";
import exportApp from "next/dist/export";
import loadConfig from "next/dist/next-server/server/config";
import { PHASE_EXPORT } from "next/dist/next-server/lib/constants";
import path from "path";
import { getNextJsDir, logger } from "../lib";

export async function buildCommand(outPath: string): Promise<void> {
  process.env.NEXT_TELEMETRY_DISABLED = "1";
  logger.info("Building 🧠 log4brains static website...");

  const nextDir = getNextJsDir();
  const nextConfig = require(path.join(nextDir, "next.config.js")) as Record<
    string,
    unknown
  >;

  // We use a different distDir than the preview mode
  // because getStaticPath()'s `fallback` config is somehow cached
  const nextCustomConfig = {
    ...nextConfig,
    distDir: ".next-export"
  };

  logger.debug("Running `next build`...");
  // @ts-ignore
  await build(nextDir, nextCustomConfig);

  logger.debug("Running `next export`...");
  await exportApp(
    nextDir,
    {
      outdir: outPath
    },
    loadConfig(PHASE_EXPORT, nextDir, nextCustomConfig) // Configuration is not handled like in build() here
  );

  logger.info(
    `✔️ Finished! Your log4brains static website is built in ${outPath}`
  );
}

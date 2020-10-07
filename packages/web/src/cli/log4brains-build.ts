import build from "next/dist/build";
import exportApp from "next/dist/export";
import { getNextJsDir, logger } from "../lib";

export async function buildCommand(outPath: string): Promise<void> {
  process.env.NEXT_TELEMETRY_DISABLED = "1";
  logger.info("Building 🧠 log4brains static website...");

  const nextDir = getNextJsDir();

  await build(nextDir);

  await exportApp(nextDir, {
    outdir: outPath
  });

  logger.info(
    `✔️ Finished! Your log4brains static website is built in ${outPath}`
  );
}

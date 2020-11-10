import build from "next/dist/build";
import exportApp from "next/dist/export";
import loadConfig from "next/dist/next-server/server/config";
import { PHASE_EXPORT } from "next/dist/next-server/lib/constants";
import path from "path";
import mkdirp from "mkdirp";
import { promises as fsP } from "fs";
import { getLog4brainsInstance, getNextJsDir, logger, Search } from "../lib";
import { toAdrLight } from "../types";

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
  const distDir = ".next-export";
  const nextCustomConfig = {
    ...nextConfig,
    distDir,
    env: {
      ...(nextConfig.env && typeof nextConfig.env === "object"
        ? nextConfig.env
        : {}),
      NEXT_PUBLIC_LOG4BRAINS_STATIC: "1"
    }
  };

  logger.debug("Running `next build`...");
  // @ts-ignore
  await build(nextDir, nextCustomConfig);

  logger.debug("Running `next export`...");
  // TODO: fix output issues
  await exportApp(
    nextDir,
    {
      outdir: outPath
    },
    loadConfig(PHASE_EXPORT, nextDir, nextCustomConfig) // Configuration is not handled like in build() here
  );

  logger.debug("Generating ADR JSON data...");
  const buildId = await fsP.readFile(
    path.join(nextDir, distDir, "BUILD_ID"),
    "utf-8"
  );

  // TODO: move to a dedicated module
  await mkdirp(path.join(outPath, "data", buildId));
  const adrs = await getLog4brainsInstance().searchAdrs();

  // TODO: remove this dead code when we are sure we don't need a JSON file per ADR

  // const packages = new Set<string>();
  // adrs.forEach((adr) => adr.package && packages.add(adr.package));
  // const mkdirpPromises = Array.from(packages).map((pkg) =>
  //   mkdirp(path.join(outPath, `data/adr/${pkg}`))
  // );
  // await Promise.all(mkdirpPromises);

  const promises = [
    // ...adrs.map((adr) =>
    //   fsP.writeFile(
    //     path.join(outPath, "data", buildId, "adr", `${adr.slug}.json`),
    //     JSON.stringify(
    //       toAdr(
    //         adr,
    //         adr.supersededBy ? getAdrBySlug(adr.supersededBy, adrs) : undefined
    //       )
    //     ),
    //     "utf-8"
    //   )
    // ),
    fsP.writeFile(
      path.join(outPath, "data", buildId, "adrs.json"),
      JSON.stringify(adrs.map(toAdrLight)),
      "utf-8"
    )
  ];
  await Promise.all(promises);

  logger.debug("Generating search index...");
  await fsP.writeFile(
    path.join(outPath, "data", buildId, "search-index.json"),
    JSON.stringify(Search.createFromAdrs(adrs).serializeIndex()),
    "utf-8"
  );

  logger.info(
    `✔️ Finished! Your log4brains static website is built in ${outPath}`
  );
}

import chalk from "chalk";
import build from "next/dist/build";
import exportApp from "next/dist/export";
import loadConfig from "next/dist/next-server/server/config";
import { PHASE_EXPORT } from "next/dist/next-server/lib/constants";
import path from "path";
import mkdirp from "mkdirp";
import { makeBadge } from "badge-maker";
import { promises as fsP } from "fs";
import type { AppConsole } from "@log4brains/cli-common";
import { getLog4brainsInstance } from "../../lib/core-api";
import { getNextJsDir } from "../../lib/next";
import { Search } from "../../lib/search";
import { toAdrLight } from "../../types";
import { execNext } from "../utils";

type Deps = {
  appConsole: AppConsole;
};

export async function buildCommand(
  { appConsole }: Deps,
  outPath: string,
  basePath: string
): Promise<void> {
  process.env.NEXT_TELEMETRY_DISABLED = "1";
  appConsole.println("Building Log4brains...");

  const nextDir = getNextJsDir();
  // eslint-disable-next-line global-require,import/no-dynamic-require,@typescript-eslint/no-var-requires
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
    basePath,
    env: {
      ...(nextConfig.env && typeof nextConfig.env === "object"
        ? nextConfig.env
        : {}),
      NEXT_PUBLIC_LOG4BRAINS_STATIC: "1"
    }
  };

  appConsole.debug("Run `next build`...");
  await execNext(async () => {
    // #NEXTJS-HACK: build() is not meant to be called from the outside of Next.js
    // And there is an error in their typings: `conf?` is typed as `null`, so we have to use @ts-ignore

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await build(nextDir, nextCustomConfig);
  });

  appConsole.debug("Run `next export`...");
  await execNext(async () => {
    await exportApp(
      nextDir,
      {
        outdir: outPath
      },
      await loadConfig(PHASE_EXPORT, nextDir, nextCustomConfig) // Configuration is not handled like in build() here
    );
  });

  appConsole.startSpinner("Generating ADR data...");
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

  // Badge
  await fsP.writeFile(
    path.join(outPath, "badge.svg"),
    makeBadge({
      label: "ADRs",
      message: adrs.length.toString(),
      color: "#FF007B"
    })
  );

  appConsole.updateSpinner("Generating search index...");
  await fsP.writeFile(
    path.join(outPath, "data", buildId, "search-index.json"),
    JSON.stringify(Search.createFromAdrs(adrs).serializeIndex()),
    "utf-8"
  );

  appConsole.stopSpinner();
  appConsole.success(
    `Your Log4brains static site was successfully generated to ${chalk.cyan(
      outPath
    )} with a total of ${chalk.cyan(`${adrs.length} ADRs`)}`
  );
  appConsole.println();
  process.exit(0); // otherwise Next.js's spinner keeps running
}

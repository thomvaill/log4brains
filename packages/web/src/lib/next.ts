import path from "path";
import fs from "fs";
import getNextConfig from "next/config";

let nextJsDir: string | null = null;
export function getNextJsDir(): string {
  if (!nextJsDir) {
    // Because when built, the src/ directory is removed
    nextJsDir = path.resolve(
      path.join(
        __dirname,
        fs.existsSync(path.join(__dirname, "../../src")) ? "../.." : ".."
      )
    );
  }
  return nextJsDir;
}

export type L4bNextConfig = {
  serverRuntimeConfig: {
    PROJECT_ROOT: string;
    VERSION: string;
  };
};

function isObjectWithGivenProperties<K extends string>(
  obj: unknown,
  properties: K[]
): obj is Record<K, unknown> {
  return (
    typeof obj === "object" &&
    obj !== null &&
    properties.every((property) => property in obj)
  );
}

function isL4bNextConfig(config: unknown): config is L4bNextConfig {
  return (
    isObjectWithGivenProperties(config, ["serverRuntimeConfig"]) &&
    isObjectWithGivenProperties(config.serverRuntimeConfig, ["VERSION"])
  );
}

export function getConfig(): L4bNextConfig {
  const config = getNextConfig() as unknown;
  if (!isL4bNextConfig(config)) {
    throw new Error(`Invalid Next.js config object: ${config}`);
  }
  return config;
}

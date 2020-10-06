import path from "path";
import fs from "fs";
import yaml from "yaml";
import { Log4brainsError } from "@src/domain";
import { Log4brainsConfig, schema } from "./schema";

const configFilename = ".log4brains.yml";

export function buildConfig(object: Record<string, unknown>): Log4brainsConfig {
  const joiResult = schema.validate(object, {
    abortEarly: false,
    convert: false
  });
  if (joiResult.error) {
    throw new Log4brainsError(
      `There is an error in the ${configFilename} config file`,
      joiResult.error?.message
    );
  }
  return joiResult.value as Log4brainsConfig;
}

export function buildConfigFromWorkdir(workdir = "."): Log4brainsConfig {
  const workdirAbsolute = path.resolve(workdir);
  const configPath = path.join(workdirAbsolute, configFilename);
  if (!fs.existsSync(configPath)) {
    throw new Log4brainsError(
      `Impossible to find the ${configFilename} config file`,
      `workdir: ${workdirAbsolute}`
    );
  }

  try {
    const content = fs.readFileSync(configPath, "utf8");
    const object = yaml.parse(content) as Record<string, unknown>;
    return buildConfig(object);
  } catch (e) {
    if (e instanceof Log4brainsError) {
      throw e;
    }
    throw new Log4brainsError(
      `Impossible to read the ${configFilename} config file`,
      e
    );
  }
}

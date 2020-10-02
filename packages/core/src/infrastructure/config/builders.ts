import path from "path";
import fs from "fs";
import yaml from "yaml";
import { Result, ok, err } from "neverthrow";
import {
  ConfigError,
  ConfigFileNotFoundError,
  ConfigParseError
} from "./errors";
import { Log4brainsConfig, schema } from "./schema";

const configFilename = ".log4brains.yml";

export function buildConfig(
  object: Record<string, unknown>
): Result<Log4brainsConfig, ConfigParseError> {
  const joiResult = schema.validate(object, {
    abortEarly: false,
    convert: false
  });
  if (joiResult.error) {
    return err(new ConfigParseError(joiResult.error));
  }
  return ok(joiResult.value);
}

export function buildConfigFromWorkdir(
  workdir = "."
): Result<Log4brainsConfig, ConfigError> {
  const workdirAbsolute = path.resolve(workdir);
  const configPath = path.join(workdirAbsolute, configFilename);
  if (!fs.existsSync(configPath)) {
    return err(new ConfigFileNotFoundError(configFilename, workdirAbsolute));
  }

  try {
    const content = fs.readFileSync(configPath, "utf8");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const object = yaml.parse(content);
    return buildConfig(object);
  } catch (e) {
    return err(new ConfigError(`Impossible to read ${configFilename}: ${e}`));
  }
}

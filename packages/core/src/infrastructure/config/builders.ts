import path from "path";
import fs from "fs";
import yaml from "yaml";
import { deepFreeze } from "@src/utils";
import { Log4brainsError } from "@src/domain";
import { Log4brainsConfig, schema } from "./schema";
import { guessGitRepositoryConfig } from "./guessGitRepositoryConfig";
import { Log4brainsConfigNotFoundError } from "./Log4brainsConfigNotFoundError";

const configFilename = ".log4brains.yml";

function getDuplicatedValues<O extends Record<string, unknown>>(
  objects: O[],
  key: keyof O
): string[] {
  const values = objects.map((object) => object[key]) as string[];
  const countsMap = values.reduce<Record<string, number>>((counts, value) => {
    return {
      ...counts,
      [value]: (counts[value] || 0) + 1
    };
  }, {});
  return Object.keys(countsMap).filter((value) => countsMap[value] > 1);
}

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
  const config = deepFreeze(joiResult.value) as Log4brainsConfig;

  // Package name duplication
  if (config.project.packages) {
    const duplicatedPackageNames = getDuplicatedValues(
      config.project.packages,
      "name"
    );
    if (duplicatedPackageNames.length > 0) {
      throw new Log4brainsError(
        "Some package names are duplicated",
        duplicatedPackageNames.join(", ")
      );
    }
  }

  return config;
}

export function buildConfigFromWorkdir(workdir = "."): Log4brainsConfig {
  const workdirAbsolute = path.resolve(workdir);
  const configPath = path.join(workdirAbsolute, configFilename);
  if (!fs.existsSync(configPath)) {
    throw new Log4brainsConfigNotFoundError();
  }

  try {
    const content = fs.readFileSync(configPath, "utf8");
    const object = yaml.parse(content) as Record<string, unknown>;
    const config = buildConfig(object);
    return deepFreeze({
      ...config,
      project: {
        ...config.project,
        repository: guessGitRepositoryConfig(config, workdir)
      }
    }) as Log4brainsConfig;
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

export function findWorkdirRecursive(cwd = "."): string {
  const cwdAbsolute = path.resolve(cwd);

  if (fs.existsSync(path.join(cwdAbsolute, configFilename))) {
    return cwdAbsolute;
  }

  const parsedPath = path.parse(cwdAbsolute);
  if (parsedPath.dir === parsedPath.root) {
    // we are at the filesystem root -> stop recursion
    throw new Log4brainsConfigNotFoundError();
  }

  return findWorkdirRecursive(path.join(cwd, ".."));
}

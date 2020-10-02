/* eslint-disable max-classes-per-file */
import Joi from "joi";

export class ConfigError extends Error {}

export class ConfigFileNotFoundError extends ConfigError {
  constructor(configFilename: string, workdir: string) {
    super(`Impossible to find ${configFilename} in ${workdir}`);
  }
}

export class ConfigParseError extends ConfigError {
  constructor(joiError: Joi.ValidationError) {
    super(joiError.message);
  }
}

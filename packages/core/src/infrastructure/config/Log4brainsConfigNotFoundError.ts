import { Log4brainsError } from "@src/domain";

export class Log4brainsConfigNotFoundError extends Log4brainsError {
  constructor() {
    super("Impossible to find the .log4brains.yml config file");
  }
}

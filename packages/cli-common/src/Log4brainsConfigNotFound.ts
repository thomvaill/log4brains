export class Log4brainsConfigNotFound extends Error {
  constructor() {
    super("Cannot find .log4brains.yml");
  }
}

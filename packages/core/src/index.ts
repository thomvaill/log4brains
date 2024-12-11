import "./polyfills";

export * from "./infrastructure/api";
export * from "./infrastructure/file-watcher";
export { Log4brainsError } from "./domain";
export {
  Log4brainsConfig,
  Log4brainsConfigNotFoundError
} from "./infrastructure/config";

import path from "path";
import { Log4brains } from "@log4brains/core";
import getConfig from "next/config";

let instance: Log4brains;

export function getLog4brainsInstance(): Log4brains {
  if (!instance) {
    if (process.env.LOG4BRAINS_PHASE === "initial-build") {
      // Noop instance during "next build" phase
      const config = getConfig();
      instance = Log4brains.create(
        path.join(config.serverRuntimeConfig.PROJECT_ROOT, "lib/core-api/noop")
      );
    } else {
      instance = Log4brains.create(process.env.LOG4BRAINS_CWD || ".");
    }
  }
  return instance;
}

import path from "path";
import { Log4brains } from "@log4brains/core";
import { getConfig } from "../next";

let instance: Log4brains;

export function getLog4brainsInstance(): Log4brains {
  if (!instance) {
    if (process.env.LOG4BRAINS_PHASE === "initial-build") {
      // Noop instance during "next build" phase
      instance = Log4brains.createFromCwd(
        path.join(
          getConfig().serverRuntimeConfig.PROJECT_ROOT,
          "lib/core-api/noop"
        )
      );
    } else {
      instance = Log4brains.createFromCwd(process.env.LOG4BRAINS_CWD || ".");
    }
  }
  return instance;
}

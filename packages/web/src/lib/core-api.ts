import { Log4brains } from "@log4brains/core";

export const l4bInstance = Log4brains.create(process.env.LOG4BRAINS_CWD || ".");

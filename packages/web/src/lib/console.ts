import { AppConsole } from "@log4brains/cli-common";

const debug = !!process.env.DEBUG;
const dev = process.env.NODE_ENV === "development";

export const appConsole = new AppConsole({ debug, traces: debug || dev });

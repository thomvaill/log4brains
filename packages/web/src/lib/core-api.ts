import { getInstance } from "@log4brains/core";

const instanceRes = getInstance(process.env.LOG4BRAINS_CWD || "."); // TODO: handle errors
if (instanceRes.isErr()) {
  throw instanceRes.error;
}

export const l4bInstance = instanceRes.value;

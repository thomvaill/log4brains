import { getInstance } from "@log4brains/core";

const instanceRes = getInstance("../..");
if (instanceRes.isErr()) {
  throw instanceRes.error;
}

export const l4bInstance = instanceRes.value;

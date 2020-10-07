/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const deepFreezeRecur = (obj: any): any => {
  if (typeof obj !== "object") {
    return obj;
  }
  Object.keys(obj).forEach((prop) => {
    if (typeof obj[prop] === "object" && !Object.isFrozen(obj[prop])) {
      deepFreezeRecur(obj[prop]);
    }
  });
  return Object.freeze(obj);
};

export const deepFreeze = <T>(obj: T): T => {
  return deepFreezeRecur(obj);
};

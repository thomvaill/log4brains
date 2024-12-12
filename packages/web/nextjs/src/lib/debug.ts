/* eslint-disable no-console */

export function debug(message: string): void {
  if (process.env.NODE_ENV === "development") {
    console.log(message);
  }
}

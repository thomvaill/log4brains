import path from "path";

export function getNextJsDir(): string {
  // Because when built, the src/ directory is removed
  return path.join(__dirname, process.env.LOG4BRAINS_DEV ? "../.." : "..");
}

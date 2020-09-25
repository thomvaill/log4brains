export function forceUnixPath(p: string): string {
  return p.replace(/\\/g, "/");
}

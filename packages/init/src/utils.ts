import { promises as fsP } from "fs";

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

/**
 * string.replaceAll() polyfill
 * TODO: remove when support down to Node 15
 * @param str
 * @param search
 * @param replacement
 */
function replaceAll(str: string, search: string, replacement: string): string {
  return str.replace(new RegExp(escapeRegExp(search), "g"), replacement);
}

export async function replaceAllInFile(
  path: string,
  replacements: [string, string][]
): Promise<void> {
  let content = await fsP.readFile(path, "utf-8");
  content = replacements.reduce((prevContent, replacement) => {
    return replaceAll(prevContent, replacement[0], replacement[1]);
  }, content);
  await fsP.writeFile(path, content, "utf-8");
}

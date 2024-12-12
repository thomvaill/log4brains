import path from "path";
import { promises as fsP } from "fs";
import { getLog4brainsInstance } from "./instance";

export async function getIndexPageMarkdown(): Promise<string> {
  const instance = getLog4brainsInstance();
  const indexPath = path.join(
    instance.workdir,
    instance.config.project.adrFolder,
    "index.md"
  );

  try {
    return await fsP.readFile(indexPath, {
      encoding: "utf8"
    });
  } catch (e) {
    return `# Architecture knowledge base

Please create \`${instance.config.project.adrFolder}/index.md\` to customize this homepage.
`;
  }
}

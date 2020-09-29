import { promises as fsP } from "fs";
import path from "path";
import { Adl } from "../../domain/Adl";

export class AdlRepository {
  constructor(private readonly path: string) {}

  async load(): Promise<Adl> {
    const adl = new Adl();
    const files = await fsP.readdir(this.path);
    await Promise.all(
      files
        .filter((filename) => {
          return filename.toLowerCase().endsWith(".md");
        })
        .map((filename) => {
          return fsP
            .readFile(path.join(this.path, filename), {
              encoding: "utf8"
            })
            .then((markdown) => {
              return adl.loadAdrFromMarkdownFile(filename, markdown);
            });
        })
    );
    return adl;
  }
}

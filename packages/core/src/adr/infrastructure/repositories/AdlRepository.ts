import { RESOLVER } from "awilix";
import { promises as fsP } from "fs";
import path from "path";
import { Adl } from "../../domain/Adl";

type ConstructorOpts = {
  adrDir: string;
};

export class AdlRepository {
  static [RESOLVER] = {}; // tells Awilix to automatically register this class

  private readonly path: string;

  constructor({ adrDir }: ConstructorOpts) {
    this.path = adrDir;
  }

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

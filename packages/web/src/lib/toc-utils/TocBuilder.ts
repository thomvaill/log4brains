import { Toc } from "./Toc";
import { TocContainer } from "./TocContainer";

export class TocBuilder {
  private readonly root: Toc;

  private current: TocContainer;

  constructor() {
    this.root = new Toc();
    this.current = this.root;
  }

  addSection(level: number, title: string, id: string): void {
    if (level <= 0) {
      throw new Error("Level must be > 0");
    }

    if (level < this.current.getLevel() + 1) {
      // eg: section to add = H2, current section = H2 -> we have to step back from one level
      if (!this.current.parent) {
        throw new Error("Never happens thanks to recursion");
      }
      this.current = this.current.parent;
      this.addSection(level, title, id);
    } else if (level > this.current.getLevel() + 1) {
      // eg: section to add = H4, current section = H2 -> we have to create an empty intermediate section
      this.current = this.current.createChild("", "");
      this.addSection(level, title, id);
    } else if (level === this.current.getLevel() + 1) {
      // recursion stop condition
      // eg: section to add = H2, current section = H1
      this.current = this.current.createChild(title, id);
    }
  }

  getToc(): Toc {
    return this.root;
  }
}

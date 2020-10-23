import { TocContainer } from "./TocContainer";
import { TocSection } from "./TocSection";

export class Toc implements TocContainer {
  public readonly parent = null;

  readonly children: TocSection[] = [];

  createChild(title: string, id: string): TocSection {
    const child = new TocSection(this, title, id);
    this.children.push(child);
    return child;
  }

  // eslint-disable-next-line class-methods-use-this
  getLevel(): number {
    return 0;
  }

  render<T>(renderer: (title: string, id: string, children: T[]) => T): T[] {
    return this.children.map((child) => child.render(renderer));
  }
}

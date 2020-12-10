import { TocContainer } from "./TocContainer";

export class TocSection {
  readonly children: TocSection[] = [];

  readonly parent: TocContainer;

  readonly title: string;

  readonly id: string;

  // Typescript parameter properties are not supported by Storybook for now! :-(
  // https://github.com/storybookjs/storybook/issues/12019
  constructor(parent: TocContainer, title: string, id: string) {
    this.parent = parent;
    this.title = title;
    this.id = id;
  }

  createChild(title: string, id: string): TocSection {
    const child = new TocSection(this, title, id);
    this.children.push(child);
    return child;
  }

  getLevel(): number {
    return this.parent.getLevel() + 1;
  }

  render<T>(renderer: (title: string, id: string, children: T[]) => T): T {
    const c = this.children.map((child) => child.render(renderer));
    return renderer(this.title, this.id, c);
  }
}

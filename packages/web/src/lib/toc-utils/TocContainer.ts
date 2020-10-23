export interface TocContainer {
  parent: TocContainer | null;
  getLevel(): number;
  createChild(title: string, id: string): TocContainer;
}

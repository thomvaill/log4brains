export abstract class Entity<T extends Record<string, unknown>> {
  constructor(public readonly props: T) {}

  public equals(e?: Entity<T>): boolean {
    return e === this; // One instance allowed per entity
  }
}

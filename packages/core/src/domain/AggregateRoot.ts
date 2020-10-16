import { Entity } from "./Entity";

export abstract class AggregateRoot<
  T extends Record<string, unknown>
> extends Entity<T> {}

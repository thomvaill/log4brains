/* eslint-disable @typescript-eslint/no-empty-function */
export abstract class Entity {
  // Because we decided to enforce "expressive error handling" (@adr-0004),
  // we can't throw Errors inside constructors.
  // So, we enforce the usage of the Static Factory Method Pattern
  protected constructor() {}
}

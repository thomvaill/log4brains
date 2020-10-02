import { isEqual } from "lodash";

// Inspired from https://khalilstemmler.com/articles/typescript-value-object/
// Thank you :-)

export interface ValueObjectProps {
  [index: string]: unknown;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structural property.
 */
export abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;

  // Because we decided to enforce "expressive error handling" (@adr-0004),
  // we can't throw Errors inside constructors.
  // So, we enforce the usage of the Static Factory Method Pattern
  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return isEqual(this.props, vo.props);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValueObject } from "./ValueObject";

export class ValueObjectArray {
  static inArray<VO extends ValueObject<any>>(
    object: VO,
    array: VO[]
  ): boolean {
    return array.some((o) => o.equals(object));
  }
}

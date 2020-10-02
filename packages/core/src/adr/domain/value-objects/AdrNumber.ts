import { Result, ok, err } from "neverthrow";
import { DomainError } from "../errors";
import { ValueObject } from "./ValueObject";

type Props = {
  value: number;
};

export class AdrNumber extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  static create(number: number): Result<AdrNumber, DomainError> {
    if (number < 0 || number > 9999) {
      return err(
        new DomainError("ADR numbers must be between 0000 and 9999", number)
      );
    }
    return ok(new AdrNumber({ value: number }));
  }

  // When we are sure of what we do
  static createUnsafe(number: number): AdrNumber {
    const result = AdrNumber.create(number);
    if (result.isErr()) {
      throw result.error;
    }
    return result.value;
  }
}

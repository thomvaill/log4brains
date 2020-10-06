import { Log4brainsError, ValueObject } from "@src/domain";

type Props = {
  value: number;
};

export class AdrNumber extends ValueObject<Props> {
  constructor(value: number) {
    super({ value });

    if (value < 0 || value > 9999) {
      throw new Log4brainsError(
        "ADR numbers must be between 0000 and 9999",
        `got ${value}`
      );
    }
  }

  get value(): number {
    return this.props.value;
  }

  get paddedStringValue(): string {
    return this.value.toString().padStart(4, "0");
  }
}

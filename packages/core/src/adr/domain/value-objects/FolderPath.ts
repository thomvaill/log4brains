import { ValueObject } from "@src/domain";

type Props = {
  value: string;
};

export class FolderPath extends ValueObject<Props> {
  constructor(value: string) {
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }
}

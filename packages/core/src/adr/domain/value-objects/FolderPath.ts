import { ValueObject } from "./ValueObject";

type Props = {
  value: string;
};

export class FolderPath extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(path: string): FolderPath {
    return new FolderPath({ value: path });
  }
}

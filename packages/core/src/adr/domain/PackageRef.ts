import { ValueObject } from "@src/domain";

type Props = {
  name: string;
};

export class PackageRef extends ValueObject<Props> {
  constructor(name: string) {
    super({ name });
  }

  get name(): string {
    return this.props.name;
  }
}

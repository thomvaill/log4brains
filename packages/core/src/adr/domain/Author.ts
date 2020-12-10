import { ValueObject } from "@src/domain";

type Props = {
  name: string;
  email?: string;
};

export class Author extends ValueObject<Props> {
  constructor(name: string, email?: string) {
    super({ name, email });
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  static createAnonymous(): Author {
    return new Author("Anonymous");
  }
}

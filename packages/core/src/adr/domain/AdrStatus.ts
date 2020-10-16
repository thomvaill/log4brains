import { Log4brainsError, ValueObject } from "@src/domain";

type Props = {
  name: string;
};

export class AdrStatus extends ValueObject<Props> {
  static DRAFT = new AdrStatus("draft");

  static PROPOSED = new AdrStatus("proposed");

  static REJECTED = new AdrStatus("rejected");

  static ACCEPTED = new AdrStatus("accepted");

  static DEPRECATED = new AdrStatus("deprecated");

  static SUPERSEDED = new AdrStatus("superseded");

  private constructor(name: string) {
    super({ name });
  }

  get name(): string {
    return this.props.name;
  }

  static createFromName(name: string): AdrStatus {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const status = Object.values(AdrStatus)
      .filter((prop) => {
        return prop instanceof AdrStatus && prop.name === name.toLowerCase();
      })
      .pop();
    if (!status) {
      throw new Log4brainsError("Unknown ADR status", name);
    }
    return status as AdrStatus;
  }
}

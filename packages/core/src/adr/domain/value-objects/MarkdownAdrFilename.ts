import { Result, ok, err } from "neverthrow";
import { DomainError } from "../errors";
import { ValueObject } from "./ValueObject";
import { AdrNumber } from "./AdrNumber";

type Props = {
  value: string;
};

export class MarkdownAdrFilename extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  extractAdrNumber(): Result<AdrNumber, DomainError> {
    const regex = /^(?:adr(?:-|_)?)?(\d+).*\.md$/i;
    const res = regex.exec(this.value);
    if (!res) {
      return err(
        new DomainError(
          "There is not valid ADR number in this filename",
          this.value
        )
      );
    }
    return AdrNumber.create(parseInt(res[1], 10));
  }

  static create(filename: string): Result<MarkdownAdrFilename, DomainError> {
    if (!filename.toLowerCase().endsWith(".md")) {
      return err(
        new DomainError(`ADR files must have an .md extension`, filename)
      );
    }
    return ok(new MarkdownAdrFilename({ value: filename }));
  }

  static createUnsafe(filename: string): MarkdownAdrFilename {
    const result = MarkdownAdrFilename.create(filename);
    if (result.isErr()) {
      throw result.error;
    }
    return result.value;
  }
}

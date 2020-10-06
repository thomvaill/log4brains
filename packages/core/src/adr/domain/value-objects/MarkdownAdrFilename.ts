import { Result, ok, err } from "neverthrow";
import { Log4brainsError, ValueObject } from "@src/domain";
import { AdrNumber } from "./AdrNumber";

type Props = {
  value: string;
};

export class MarkdownAdrFilename extends ValueObject<Props> {
  constructor(value: string) {
    super({ value });

    if (!value.toLowerCase().endsWith(".md")) {
      throw new Log4brainsError("Only .md ADR files are supported", value);
    }
  }

  get value(): string {
    return this.props.value;
  }

  extractAdrNumber(): Result<AdrNumber, Log4brainsError> {
    const regex = /^(?:adr(?:-|_)?)?(\d+).*\.md$/i;
    const res = regex.exec(this.value);
    if (!res) {
      return err(
        new Log4brainsError("No ADR number found in its filename", this.value)
      );
    }

    try {
      return ok(new AdrNumber(parseInt(res[1], 10)));
    } catch (e) {
      if (e instanceof Log4brainsError) {
        return err(e);
      }
      throw e;
    }
  }
}

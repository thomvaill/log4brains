import { ValueObject } from "@src/domain";
import { MarkdownAdrFilename } from "./MarkdownAdrFilename";

type Props = {
  value: string;
};

export class AdrSlug extends ValueObject<Props> {
  constructor(value: string) {
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }

  static createFromFilename(filename: MarkdownAdrFilename): AdrSlug {
    return new AdrSlug(filename.value.replace(/\.md$/i, ""));
  }
}

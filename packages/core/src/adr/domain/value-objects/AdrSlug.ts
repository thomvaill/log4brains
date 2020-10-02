import { ValueObject } from "./ValueObject";
import { MarkdownAdrFilename } from "./MarkdownAdrFilename";

type Props = {
  value: string;
};

export class AdrSlug extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static createFromFilename(filename: MarkdownAdrFilename): AdrSlug {
    return new AdrSlug({ value: filename.value.replace(/\.md$/i, "") });
  }
}

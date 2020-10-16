import { AggregateRoot } from "@src/domain";
import { AdrFile } from "./AdrFile";
import { AdrSlug } from "./AdrSlug";
import { AdrStatus } from "./AdrStatus";
import { MarkdownBody } from "./MarkdownBody";
import { PackageRef } from "./PackageRef";

type Props = {
  slug: AdrSlug;
  package?: PackageRef;
  body: MarkdownBody;
  file: AdrFile;
};

export class Adr extends AggregateRoot<Props> {
  get slug(): AdrSlug {
    return this.props.slug;
  }

  get package(): PackageRef | undefined {
    return this.props.package;
  }

  get body(): MarkdownBody {
    return this.props.body;
  }

  get file(): AdrFile {
    return this.props.file;
  }

  get title(): string | undefined {
    return this.body.getFirstH1Title();
  }

  get status(): AdrStatus {
    return AdrStatus.DRAFT; // TODO
  }

  get superseder(): AdrSlug | undefined {
    return undefined; // TODO
  }

  get date(): Date {
    return new Date("2020-01-01"); // TODO
  }

  get tags(): string[] {
    return []; // TODO
  }
}

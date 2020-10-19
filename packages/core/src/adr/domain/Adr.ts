import { AggregateRoot } from "@src/domain";
import { AdrFile } from "./AdrFile";
import { AdrSlug } from "./AdrSlug";
import { AdrStatus } from "./AdrStatus";
import { MarkdownBody } from "./MarkdownBody";
import { PackageRef } from "./PackageRef";

const defaultStatus = AdrStatus.DRAFT;

type Props = {
  slug: AdrSlug;
  package?: PackageRef;
  body: MarkdownBody;
  file?: AdrFile; // set by the repository after save()
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

  get file(): AdrFile | undefined {
    return this.props.file;
  }

  get title(): string | undefined {
    return this.body.getFirstH1Title();
  }

  get status(): AdrStatus {
    const statusStr = this.body.getHeaderMetadata("Status");
    if (!statusStr) {
      return defaultStatus;
    }
    try {
      return AdrStatus.createFromName(statusStr);
    } catch (e) {
      console.log(`Warning: ${e.message}`); // TODO: log
      return defaultStatus;
    }
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

  setFile(file: AdrFile): void {
    this.props.file = file;
  }

  setTitle(title: string): void {
    this.body.setFirstH1Title(title);
  }
}

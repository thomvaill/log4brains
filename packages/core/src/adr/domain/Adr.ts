import { AggregateRoot } from "@src/domain";
import { AdrFile } from "./AdrFile";
import { MarkdownAdrLink } from "./MarkdownAdrLink";
import { AdrSlug } from "./AdrSlug";
import { AdrStatus } from "./AdrStatus";
import { MarkdownBody } from "./MarkdownBody";
import { PackageRef } from "./PackageRef";
import { AdrRelation } from "./AdrRelation";

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
    return this.body.getFirstH1Title(); // TODO: log when no title
  }

  get status(): AdrStatus {
    const statusStr = this.body.getHeaderMetadata("Status");
    if (!statusStr) {
      return defaultStatus;
    }
    try {
      return AdrStatus.createFromName(statusStr);
    } catch (e) {
      return defaultStatus; // TODO: log
    }
  }

  get superseder(): AdrSlug | undefined {
    const statusStr = this.body.getHeaderMetadata("Status");
    if (!this.status.equals(AdrStatus.SUPERSEDED) || !statusStr) {
      return undefined;
    }
    const slug = statusStr.replace(/superseded\s*by\s*:?/i, "").trim();
    try {
      return slug ? new AdrSlug(slug) : undefined;
    } catch (e) {
      return undefined; // TODO: log
    }
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

  supersedeBy(superseder: Adr): void {
    const relation = new AdrRelation(this, "superseded by", superseder);
    this.body.setHeaderMetadata("Status", relation.toMarkdown());
    superseder.markAsSuperseder(this);
  }

  private markAsSuperseder(superseded: Adr): void {
    const relation = new AdrRelation(this, "Supersedes", superseded);
    this.body.addLinkNoDuplicate(relation.toMarkdown());
  }
}

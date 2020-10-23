import { AggregateRoot } from "@src/domain";
import { AdrFile } from "./AdrFile";
import { MarkdownAdrLink } from "./MarkdownAdrLink";
import { AdrSlug } from "./AdrSlug";
import { AdrStatus } from "./AdrStatus";
import { MarkdownBody } from "./MarkdownBody";
import { PackageRef } from "./PackageRef";
import { AdrRelation } from "./AdrRelation";
import { Author } from "./Author";

type Props = {
  slug: AdrSlug;
  package?: PackageRef;
  body: MarkdownBody;
  file?: AdrFile; // set by the repository after save()
  creationDate?: Date;
  lastEditDate?: Date;
  lastEditAuthor?: Author;
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

  get creationDate(): Date | undefined {
    return this.props.creationDate;
  }

  get lastEditDate(): Date | undefined {
    return this.props.lastEditDate;
  }

  get lastEditAuthor(): Author | undefined {
    return this.props.lastEditAuthor;
  }

  get title(): string | undefined {
    return this.body.getFirstH1Title(); // TODO: log when no title
  }

  get status(): AdrStatus {
    const statusStr = this.body.getHeaderMetadata("Status");
    if (!statusStr) {
      if (this.publicationDate) {
        return AdrStatus.ACCEPTED;
      }
      return AdrStatus.DRAFT;
    }
    try {
      return AdrStatus.createFromName(statusStr);
    } catch (e) {
      return AdrStatus.DRAFT; // TODO: log
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

  get publicationDate(): Date | undefined {
    const dateStr = this.body.getHeaderMetadata("date");
    if (!dateStr) {
      return undefined;
    }
    const date = new Date(dateStr);
    if (!date) {
      return undefined;
    }

    // For sorting purpose:
    // An ADR without a publication date is sorted based on its creationDate.
    // Usually, ADRs created on the same publicationDate of another ADR are older than this one.
    date.setHours(23, 59, 59);

    return date;
  }

  get publicationDateOrCreationDate(): Date | undefined {
    return this.publicationDate || this.creationDate || undefined;
  }

  get tags(): string[] {
    const tags = this.body.getHeaderMetadata("tags");
    if (!tags || tags.trim() === "") {
      return [];
    }
    return tags.split(/\s*[\s,]{1}\s*/).map((tag) => tag.trim().toLowerCase());
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

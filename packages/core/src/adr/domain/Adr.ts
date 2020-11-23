import { AggregateRoot } from "@src/domain";
import { AdrFile } from "./AdrFile";
import { AdrSlug } from "./AdrSlug";
import { AdrStatus } from "./AdrStatus";
import type { MarkdownBody } from "./MarkdownBody";
import { PackageRef } from "./PackageRef";
import { AdrRelation } from "./AdrRelation";
import { Author } from "./Author";

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Props = {
  slug: AdrSlug;
  package?: PackageRef;
  body: MarkdownBody;
  file?: AdrFile; // set by the repository after save()
  creationDate: Date; // set by the repository after save() or automatically set to now()
  lastEditDate: Date; // set by the repository after save() or automatically set to now()
  lastEditAuthor: Author; // set by the repository after save() or automatically set to anonymous
};

export class Adr extends AggregateRoot<Props> {
  constructor(
    props: WithOptional<
      Props,
      "creationDate" | "lastEditDate" | "lastEditAuthor"
    >
  ) {
    super({
      creationDate: props.creationDate || new Date(),
      lastEditDate: props.lastEditDate || new Date(),
      lastEditAuthor: props.lastEditAuthor || Author.createAnonymous(),
      ...props
    });
  }

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

  get creationDate(): Date {
    return this.props.creationDate;
  }

  get lastEditDate(): Date {
    return this.props.lastEditDate;
  }

  get lastEditAuthor(): Author {
    return this.props.lastEditAuthor;
  }

  get title(): string | undefined {
    return this.body.getFirstH1Title(); // TODO: log when no title
  }

  get status(): AdrStatus {
    const statusStr = this.body.getHeaderMetadata("Status");
    if (!statusStr) {
      return AdrStatus.ACCEPTED;
    }
    try {
      return AdrStatus.createFromName(statusStr);
    } catch (e) {
      return AdrStatus.DRAFT; // TODO: log (DRAFT because usually the help from the template)
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

  get tags(): string[] {
    const tags = this.body.getHeaderMetadata("tags");
    if (!tags || tags.trim() === "") {
      return [];
    }
    return tags.split(/\s*[\s,]{1}\s*/).map((tag) => tag.trim().toLowerCase());
  }

  get deciders(): string[] {
    const deciders = this.body.getHeaderMetadata("deciders");
    if (!deciders || deciders.trim() === "") {
      return [];
    }
    return deciders.split(/\s*[,]{1}\s*/).map((decider) => decider.trim());
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

  async getEnhancedMdx(): Promise<string> {
    const bodyCopy = this.body.clone();

    // Remove title
    bodyCopy.deleteFirstH1Title();

    // Remove header metadata
    ["status", "deciders", "date", "tags"].forEach((metadata) =>
      bodyCopy.deleteHeaderMetadata(metadata)
    );

    // Replace links
    await bodyCopy.replaceAdrLinks(this);

    return bodyCopy.getRawMarkdown();
  }

  static compare(a: Adr, b: Adr): number {
    // PublicationDate always wins on creationDate
    const aDate = a.publicationDate || a.creationDate;
    const bDate = b.publicationDate || b.creationDate;

    const dateDiff = aDate.getTime() - bDate.getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }

    // When the dates are equal, we compare the slugs' name parts
    const aSlugNamePart = a.slug.namePart.toLowerCase();
    const bSlugNamePart = b.slug.namePart.toLowerCase();

    if (aSlugNamePart === bSlugNamePart) {
      // Special case: when the name parts are equal, we take the package name into account
      // This case is very rare but we have to take it into account so that the results are not random
      return a.slug.value.toLowerCase() < b.slug.value.toLowerCase() ? -1 : 1;
    }

    return aSlugNamePart < bSlugNamePart ? -1 : 1;
  }
}

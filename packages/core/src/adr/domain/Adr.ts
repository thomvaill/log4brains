import { Result, ok, err } from "neverthrow";
import { Diagnosticable } from "./Diagnosticable";
import { Entity } from "./Entity";
import {
  AcceptableDomainError,
  DomainError,
  DomainErrorSeverity
} from "./errors";
import {
  AdrNumber,
  AdrSlug,
  FolderReference,
  MarkdownAdrFilename,
  MarkdownBody
} from "./value-objects";

export class Adr extends Entity implements Diagnosticable {
  readonly slug: AdrSlug;

  readonly errors: AcceptableDomainError[] = [];

  private computedTitle?: string;

  private constructor(
    readonly folder: FolderReference,
    readonly filename: MarkdownAdrFilename,
    readonly number: AdrNumber,
    readonly body: MarkdownBody
  ) {
    super();

    // Slug
    this.slug = AdrSlug.createFromFilename(filename);

    // Title
    const title = body.getFirstH1Title();
    if (title === undefined) {
      this.errors.push(
        new AcceptableDomainError(
          DomainErrorSeverity.WARNING,
          "This ADR has no H1 title"
        ).setLocation(filename.value)
      );
    } else {
      this.computedTitle = title;
    }
  }

  get title(): string | undefined {
    return this.computedTitle;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  static create(
    folder: FolderReference,
    filename: MarkdownAdrFilename,
    body: MarkdownBody
  ): Result<Adr, DomainError> {
    // Number
    const numberRes = filename.extractAdrNumber();
    if (numberRes.isErr()) {
      return err(numberRes.error);
    }
    return ok(new Adr(folder, filename, numberRes.value, body));
  }

  static createStrict(
    folder: FolderReference,
    filename: MarkdownAdrFilename,
    body: MarkdownBody
  ): Result<Adr, DomainError> {
    const adrRes = Adr.create(folder, filename, body);
    if (adrRes.isErr()) {
      return adrRes;
    }
    const adr = adrRes.value;
    if (adr.hasErrors()) {
      return err(adr.errors[0]);
    }
    return ok(adr);
  }
}

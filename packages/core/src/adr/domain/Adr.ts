import {
  Diagnosticable,
  DiagnosticList,
  DiagnosticSeverity,
  DiagnosticType,
  LocatableDiagnostic
} from "./diagnostics";
import {
  AdrNumber,
  AdrSlug,
  FolderReference,
  MarkdownAdrFilename,
  MarkdownBody
} from "./value-objects";

export class Adr implements Diagnosticable {
  readonly number?: AdrNumber;

  readonly slug: AdrSlug;

  readonly title?: string;

  readonly diagnostics: DiagnosticList = new DiagnosticList();

  constructor(
    readonly folder: FolderReference,
    readonly filename: MarkdownAdrFilename,
    readonly body: MarkdownBody
  ) {
    // Number
    const numberRes = filename.extractAdrNumber();
    if (numberRes.isOk()) {
      this.number = numberRes.value;
    } else {
      this.addDiagnostic(
        DiagnosticType.ADR_NUMBER_MISSING,
        DiagnosticSeverity.WARNING,
        numberRes.error.message
      );
    }

    // Slug
    this.slug = AdrSlug.createFromFilename(filename);

    // Title
    const title = body.getFirstH1Title();
    if (title === undefined) {
      this.addDiagnostic(
        DiagnosticType.ADR_TITLE_MISSING,
        DiagnosticSeverity.WARNING
      );
    } else {
      this.title = title;
    }
  }

  private addDiagnostic(
    type: DiagnosticType,
    severity: DiagnosticSeverity,
    details?: string
  ) {
    this.diagnostics.push(
      new LocatableDiagnostic(
        `ADR ${this.filename.value}${
          this.folder.root ? "" : ` ("${this.folder.name}" folder)`
        }`,
        type,
        severity,
        details
      )
    );
  }
}

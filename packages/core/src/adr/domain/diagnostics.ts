/* eslint-disable max-classes-per-file */
export enum DiagnosticSeverity {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info"
}

export class Diagnostic {
  constructor(
    readonly severity: DiagnosticSeverity,
    readonly message: string,
    readonly filename?: string
  ) {}
}

export class CantExtractAdrNumberFromFilename extends Diagnostic {
  constructor(filename: string) {
    super(
      DiagnosticSeverity.INFO,
      "This file was ignored because we cannot extract an ADR number from its name",
      filename
    );
  }
}

export class AdrNumberDuplicate extends Diagnostic {
  constructor(filename: string, number: number) {
    super(
      DiagnosticSeverity.WARNING,
      `This ADR number already exists: ${number}`,
      filename
    );
  }
}

export class MissingH1Title extends Diagnostic {
  constructor(filename: string) {
    super(DiagnosticSeverity.WARNING, "This ADR has no H1 title", filename);
  }
}

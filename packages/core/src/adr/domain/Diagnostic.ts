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

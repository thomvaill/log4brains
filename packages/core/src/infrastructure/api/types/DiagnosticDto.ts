export enum DiagnosticSeverity {
  WARNING = "warning",
  INFO = "info"
}

export type DiagnosticDto = {
  code: string;
  severity: DiagnosticSeverity;
  message: string;
};

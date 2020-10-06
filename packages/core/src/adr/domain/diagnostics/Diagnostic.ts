import { DiagnosticSeverity } from "./DiagnosticSeverity";
import { DiagnosticType } from "./DiagnosticType";

export class Diagnostic {
  constructor(
    public readonly type: DiagnosticType,
    public readonly severity: DiagnosticSeverity,
    public readonly details?: string
  ) {}
}

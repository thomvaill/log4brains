import { Diagnostic } from "./Diagnostic";
import { DiagnosticSeverity } from "./DiagnosticSeverity";
import { DiagnosticType } from "./DiagnosticType";

export class LocatableDiagnostic extends Diagnostic {
  constructor(
    public readonly location: string,
    type: DiagnosticType,
    severity: DiagnosticSeverity,
    details?: string
  ) {
    super(type, severity, details ? ` - in ${location}` : `in ${location}`);
  }
}

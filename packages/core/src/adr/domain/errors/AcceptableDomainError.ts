import { DomainError } from "./DomainError";

export enum DomainErrorSeverity {
  WARNING = "warning",
  INFO = "info"
}

// Acceptable errors during Markdown files parsing
// because we want to support already existing projects as much as possible
export class AcceptableDomainError extends DomainError {
  constructor(
    readonly severity: DomainErrorSeverity,
    reason: string,
    got?: unknown
  ) {
    super(reason, got);
  }

  static create(
    error: DomainError,
    severity: DomainErrorSeverity
  ): AcceptableDomainError {
    return new AcceptableDomainError(severity, error.reason, error.got);
  }
}

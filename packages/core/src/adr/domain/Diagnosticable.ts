import { AcceptableDomainError } from "./errors";

export interface Diagnosticable {
  errors: AcceptableDomainError[];
  hasErrors(): boolean;
}

import { Diagnosticable } from "./Diagnosticable";
import { AcceptableDomainError } from "./errors";

export interface DiagnosticableParent extends Diagnosticable {
  hasErrorsInSelfOrChildren(): boolean;
  getSelfAndChildrenErrors(): AcceptableDomainError[];
}

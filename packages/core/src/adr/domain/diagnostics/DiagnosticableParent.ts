import { Diagnosticable } from "./Diagnosticable";
import { DiagnosticList } from "./DiagnosticList";

export interface DiagnosticableParent extends Diagnosticable {
  getSelfAndChildrenDiagnostics(): DiagnosticList;
}

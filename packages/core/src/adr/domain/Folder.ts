import { uniq } from "lodash";
import { Adr } from "./Adr";
import { AdrNumber, FolderReference } from "./value-objects";
import {
  DiagnosticableParent,
  DiagnosticList,
  DiagnosticSeverity,
  DiagnosticType,
  LocatableDiagnostic
} from "./diagnostics";

export class Folder implements DiagnosticableParent {
  readonly diagnostics: DiagnosticList = new DiagnosticList();

  constructor(readonly ref: FolderReference, readonly adrs: Adr[] = []) {
    // Duplicates
    this.getDuplicatedAdrNumbers().forEach((number) => {
      this.addDiagnostic(
        DiagnosticType.DUPLICATED_ADR_NUMBER,
        DiagnosticSeverity.WARNING,
        `#${number.paddedStringValue}`
      );
    });
  }

  getDuplicatedAdrNumbers(): AdrNumber[] {
    const numbers = this.adrs
      .map((adr) => (adr.number ? adr.number.value : undefined))
      .filter((nbOrUndef) => nbOrUndef !== undefined) as number[];
    return uniq(
      numbers.filter((number, index) => numbers.indexOf(number) !== index)
    ).map((number) => new AdrNumber(number));
  }

  getAdrsByNumber(number: AdrNumber): Adr[] {
    return this.adrs.filter((adr) => {
      return adr.number && adr.number.equals(number);
    });
  }

  getSelfAndChildrenDiagnostics(): DiagnosticList {
    return new DiagnosticList(
      ...this.diagnostics,
      ...this.adrs.map((adr) => adr.diagnostics).flat()
    );
  }

  private addDiagnostic(
    type: DiagnosticType,
    severity: DiagnosticSeverity,
    details?: string
  ) {
    this.diagnostics.push(
      new LocatableDiagnostic(
        this.ref.root ? "Root ADR folder" : `Folder ${this.ref.name}`,
        type,
        severity,
        details
      )
    );
  }
}

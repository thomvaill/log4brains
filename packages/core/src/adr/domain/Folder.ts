import { Result, ok, err } from "neverthrow";
import { uniq } from "lodash";
import { Adr } from "./Adr";
import { AggregateRoot } from "./AggregateRoot";
import {
  AcceptableDomainError,
  DomainErrorSeverity,
  DomainError
} from "./errors";
import { AdrNumber, FolderReference } from "./value-objects";
import { DiagnosticableParent } from "./DiagnosticableParent";

export class Folder extends AggregateRoot implements DiagnosticableParent {
  readonly errors: AcceptableDomainError[] = [];

  private constructor(
    readonly ref: FolderReference,
    readonly adrs: Adr[] = [],
    preloadErrors: AcceptableDomainError[] = []
  ) {
    super();

    this.errors = preloadErrors;

    // Duplicates
    this.getDuplicatedAdrNumbers().forEach((number) => {
      const error = new AcceptableDomainError(
        DomainErrorSeverity.WARNING,
        `Multiple ADRs have the same number: #${number.value}`
      );
      if (!ref.root && ref.name) {
        error.setLocation(ref.name);
      }
      this.errors.push(error);
    });
  }

  getDuplicatedAdrNumbers(): AdrNumber[] {
    const numbers = this.adrs
      .filter((adr) => adr.number !== undefined)
      .map((adr) => (adr.number ? adr.number.value : NaN));
    return uniq(
      numbers.filter((number, index) => numbers.indexOf(number) !== index)
    ).map((number) => AdrNumber.createUnsafe(number));
  }

  getAdrsByNumber(number: AdrNumber): Adr[] {
    return this.adrs.filter((adr) => {
      return adr.number && adr.number.equals(number);
    });
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getSelfAndChildrenErrors(): AcceptableDomainError[] {
    return [...this.errors, ...this.adrs.map((adr) => adr.errors).flat()];
  }

  hasErrorsInSelfOrChildren(): boolean {
    return this.getSelfAndChildrenErrors().length > 0;
  }

  static create(
    ref: FolderReference,
    adrs: Adr[],
    preloadErrors: AcceptableDomainError[] = []
  ): Folder {
    return new Folder(ref, adrs, preloadErrors);
  }

  static createStrict(
    ref: FolderReference,
    adrs: Adr[]
  ): Result<Folder, DomainError> {
    const folder = Folder.create(ref, adrs);
    if (folder.hasErrors()) {
      return err(folder.errors[0]);
    }
    return ok(folder);
  }
}

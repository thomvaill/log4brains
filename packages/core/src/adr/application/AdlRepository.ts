import { Adl } from "../domain/Adl";

export interface AdlRepository {
  load(): Adl;
}

export class AdlRepositoryError extends Error {}

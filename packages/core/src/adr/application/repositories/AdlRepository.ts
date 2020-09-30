import { Adl } from "../../domain/Adl";

export interface AdlRepository {
  load(): Promise<Adl>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from "./Query";
import { QueryResult } from "./QueryResult";

export interface QueryHandler<
  Q extends Query = any,
  QR extends QueryResult = any
> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly queryClass: Function;
  execute(query: Q): Promise<QR>;
}

/* eslint-disable @typescript-eslint/ban-types */
import { Query, QueryHandler, QueryResult } from "@src/application";

export class QueryBus {
  private readonly handlersByQueryName: Map<string, QueryHandler> = new Map<
    string,
    QueryHandler
  >();

  registerHandler(handler: QueryHandler, queryClass: Function): void {
    this.handlersByQueryName.set(queryClass.name, handler);
  }

  async dispatch<QR extends QueryResult>(query: Query): Promise<QR> {
    const queryName = query.constructor.name;
    const handler = this.handlersByQueryName.get(queryName);
    if (!handler) {
      throw new Error(`No handler registered for this query: ${queryName}`);
    }
    return handler.execute(query) as Promise<QR>;
  }
}

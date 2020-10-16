import Table from "cli-table3";
import { Log4brains, SearchAdrsFilters, AdrDtoStatus } from "@log4brains/core";
import { Console } from "../console";

type Deps = {
  l4bInstance: Log4brains;
  appConsole: Console;
};

export type ListCommandOpts = {
  statuses: string;
};

export class ListCommand {
  private readonly l4bInstance: Log4brains;

  private readonly console: Console;

  constructor({ l4bInstance, appConsole }: Deps) {
    this.l4bInstance = l4bInstance;
    this.console = appConsole;
  }

  async execute(opts: ListCommandOpts): Promise<void> {
    const filters: SearchAdrsFilters = {};
    if (opts.statuses) {
      filters.statuses = opts.statuses.split(",") as AdrDtoStatus[];
    }
    const adrs = await this.l4bInstance.searchAdrs(filters);
    const table = new Table({ head: ["Status", "Package", "Title"] });
    adrs.forEach((adr) => {
      table.push([
        adr.status.toUpperCase(),
        adr.package || "",
        adr.title || "Untitled"
      ]);
    });
    this.console.table(table);
  }
}

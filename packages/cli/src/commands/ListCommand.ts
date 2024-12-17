import { Log4brains, SearchAdrsFilters, AdrDtoStatus } from "@log4brains/core";
import type { AppConsole } from "@log4brains/cli-common";

type Deps = {
  l4bInstance: Log4brains;
  appConsole: AppConsole;
};

export type ListCommandOpts = {
  statuses: string;
  tags: string;
  raw: boolean;
};

export class ListCommand {
  private readonly l4bInstance: Log4brains;

  private readonly console: AppConsole;

  constructor({ l4bInstance, appConsole }: Deps) {
    this.l4bInstance = l4bInstance;
    this.console = appConsole;
  }

  async execute(opts: ListCommandOpts): Promise<void> {
    const filters: SearchAdrsFilters = {};
    if (opts.statuses) {
      filters.statuses = opts.statuses.split(",") as AdrDtoStatus[];
    }
    if (opts.tags) {
      filters.tags = opts.tags.split(",");
    }
    const adrs = await this.l4bInstance.searchAdrs(filters);
    const table = this.console.createTable({
      head: ["Slug", "Status", "Package", "Title"]
    });
    adrs.forEach((adr) => {
      table.push([
        adr.slug,
        adr.status.toUpperCase(),
        adr.package || "",
        adr.title || "Untitled"
      ]);
    });
    this.console.printTable(table, opts.raw);
  }
}

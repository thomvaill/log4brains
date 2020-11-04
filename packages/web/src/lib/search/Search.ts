import lunr from "lunr";
import { AdrDto } from "@log4brains/core";

// Inspired by https://github.com/squidfunk/mkdocs-material/tree/master/src/assets/javascripts/integrations/search

export type SearchResult = {
  title: string;
  href: string;
};

export class Search {
  constructor(
    private readonly adrs: AdrDto[], // TODO: do not store all ADRs here?
    private readonly index: lunr.Index
  ) {}

  search(query: string): SearchResult[] {
    return this.index.search(`${query}*`).map((lunrResult) => {
      const adr = this.getAdrBySlug(lunrResult.ref);
      return {
        title: adr.title || "Untitled",
        href: `/adr/${adr.slug}`
      };
    });
  }

  private getAdrBySlug(slug: string): AdrDto {
    const adr = this.adrs.filter((a) => a.slug === slug).pop();
    if (!adr) {
      throw new Error(`Unknown ADR slug: ${slug}`);
    }
    return adr;
  }

  static createFromAdrs(adrs: AdrDto[]): Search {
    const index = lunr((builder) => {
      builder.ref("slug");
      builder.field("title", { boost: 1000 });
      builder.field("body");

      adrs.forEach((adr) => {
        builder.add({
          slug: adr.slug,
          title: adr.title,
          body: adr.body.rawMarkdown
        });
      });
    });
    return new Search(adrs, index);
  }
}

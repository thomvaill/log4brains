/* eslint-disable @typescript-eslint/ban-types */
import { AdrDto } from "@log4brains/core";
import lunr from "lunr";

type AdrForSearch = {
  title: string;
  verbatim: string; // body without Markdown or HTML tags, without recurring headers
};

export type SerializedIndex = {
  lunr: object;
  adrs: [string, AdrForSearch][];
};

export type SearchResult = {
  slug: string;
  href: string;
  title: string;

  /**
   * A number between 0 and 1 representing how similar this document is to the query.
   * @see lunr.Index.Result
   */
  score: number;

  // TODO: add highlighted verbatim (https://github.com/thomvaill/log4brains/issues/5)
};

function mapToJson<K, V>(map: Map<K, V>): [K, V][] {
  return Array.from(map.entries());
}

function mapFromJson<K, V>(entries: [K, V][]): Map<K, V> {
  return new Map(entries);
}

/**
 * Inspired by https://github.com/squidfunk/mkdocs-material/tree/master/src/assets/javascripts/integrations/search
 */
export class Search {
  private constructor(
    private readonly index: lunr.Index,
    private readonly adrs: Map<string, AdrForSearch>
  ) {}

  search(query: string): SearchResult[] {
    return this.index.search(`${query}*`).map((result) => {
      const adr = this.adrs.get(result.ref);
      if (!adr) {
        throw new Error(`Invalid Search instance: missing ADR "${result.ref}"`);
      }
      return {
        slug: result.ref,
        href: `/adr/${result.ref}`,
        title: adr.title,
        score: result.score
      };
    });
  }

  serializeIndex(): SerializedIndex {
    return { lunr: this.index.toJSON(), adrs: mapToJson(this.adrs) };
  }

  static createFromAdrs(adrs: AdrDto[]): Search {
    const adrsForSearch = new Map<string, AdrForSearch>(
      adrs.map((adr) => [
        adr.slug,
        {
          title: adr.title || "Untitled",
          verbatim: adr.body.enhancedMdx // TODO: remove tags (https://github.com/thomvaill/log4brains/issues/5)
        }
      ])
    );

    const index = lunr((builder) => {
      builder.ref("slug");
      builder.field("title", { boost: 1000 });
      builder.field("verbatim");
      // eslint-disable-next-line no-param-reassign
      builder.metadataWhitelist = ["position"];

      adrsForSearch.forEach((adr, slug) => {
        builder.add({
          slug,
          title: adr.title,
          verbatim: adr.verbatim
        });
      });
    });
    return new Search(index, adrsForSearch);
  }

  static createFromSerializedIndex(serializedIndex: SerializedIndex): Search {
    return new Search(
      lunr.Index.load(serializedIndex.lunr),
      mapFromJson(serializedIndex.adrs)
    );
  }
}

/* eslint-disable @typescript-eslint/ban-types */
import lunr, { Index } from "lunr";
import { Adr } from "../../types";

// Inspired by https://github.com/squidfunk/mkdocs-material/tree/master/src/assets/javascripts/integrations/search

export class Search {
  private constructor(private readonly index: lunr.Index) {}

  search(query: string): Index.Result[] {
    return this.index.search(`${query}*`);
  }

  serializeIndex(): object {
    return this.index.toJSON();
  }

  static createFromAdrs(adrs: Adr[]): Search {
    const index = lunr((builder) => {
      builder.ref("slug");
      builder.field("title", { boost: 1000 });
      builder.field("body");
      builder.metadataWhitelist = ["position"];

      adrs.forEach((adr) => {
        builder.add({
          slug: adr.slug,
          title: adr.title,
          body: adr.body.enhancedMdx // TODO: to improve
        });
      });
    });
    return new Search(index);
  }

  static createFromSerializedIndex(serializedIndex: object): Search {
    return new Search(lunr.Index.load(serializedIndex));
  }
}

import cheerio from "cheerio";

export class CheerioMarkdownElement {
  constructor(private readonly cheerioElt: cheerio.Cheerio) {}

  get startLine(): number | undefined {
    const data = this.cheerioElt.data("sourceLineStart") as string | undefined;
    return data !== undefined ? parseInt(data, 10) : undefined;
  }

  get endLine(): number | undefined {
    const data = this.cheerioElt.data("sourceLineEnd") as string | undefined;
    return data !== undefined ? parseInt(data, 10) : undefined;
  }

  get markup(): string | undefined {
    const data = this.cheerioElt.data("sourceMarkup") as string | undefined;
    return data !== undefined ? data : undefined;
  }

  get level(): number | undefined {
    const data = this.cheerioElt.data("sourceLevel") as string | undefined;
    return data !== undefined ? parseInt(data, 10) : undefined;
  }
}

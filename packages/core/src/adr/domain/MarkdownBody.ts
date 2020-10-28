import cheerio from "cheerio";
import { Entity, Log4brainsError } from "@src/domain";
import { CheerioMarkdown } from "@src/lib/cheerio-markdown";
import { Adr } from "./Adr";
import { MarkdownAdrLinkResolver } from "./MarkdownAdrLinkResolver";

type Props = {
  value: string;
};

type ElementAndRegExpMatch = {
  element: cheerio.Cheerio;
  match: string[];
};

type Link = {
  text: string;
  href: string;
};

function htmlentities(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cheerioToMarkdown(elt: cheerio.Cheerio, keepLinks: boolean): string {
  const html = elt.html();
  if (!html) {
    return "";
  }
  const copy = cheerio.load(html);

  if (keepLinks) {
    copy("a").each((i, elt) => {
      copy(elt).text(`[${copy(elt).text()}](${copy(elt).attr("href")})`);
    });
  }

  return copy("body").text();
}

export class MarkdownBody extends Entity<Props> {
  private cm: CheerioMarkdown;

  private adrLinkResolver?: MarkdownAdrLinkResolver;

  constructor(value: string) {
    super({ value });
    this.cm = new CheerioMarkdown(value);
    this.cm.onChange((newValue) => {
      this.props.value = newValue;
    });
  }

  setAdrLinkResolver(resolver: MarkdownAdrLinkResolver): MarkdownBody {
    this.adrLinkResolver = resolver;
    return this;
  }

  private getFirstH1TitleElement(): cheerio.Cheerio | undefined {
    const elt = this.cm.$("h1").first();
    return elt.length > 0 ? elt : undefined;
  }

  getFirstH1Title(): string | undefined {
    return this.getFirstH1TitleElement()?.text();
  }

  setFirstH1Title(title: string): void {
    const elt = this.getFirstH1TitleElement();
    if (elt) {
      this.cm.replaceText(elt, title);
    } else {
      this.cm.insertLineAt(0, `# ${title}`);
    }
  }

  deleteFirstH1Title(): void {
    const elt = this.getFirstH1TitleElement();
    if (elt) {
      this.cm.deleteElement(elt);
    }
  }

  private getHeaderMetadataUl(): cheerio.Cheerio | undefined {
    const elts = this.cm.$("body > *:first-child").nextUntil("h2").addBack();
    const ul = elts.filter("ul").first();
    return ul.length > 0 ? ul : undefined;
  }

  private getHeaderMetadataElementAndMatch(
    key: string
  ): ElementAndRegExpMatch | undefined {
    const ul = this.getHeaderMetadataUl();
    if (!ul) {
      return undefined;
    }
    const regexp = new RegExp(`^(\\s*${key}\\s*:\\s*)(.*)$`, "i");
    const result = ul
      .children()
      .map((i, li) => {
        const line = this.cm.$(li);
        const match = regexp.exec(line.text());
        return match ? { element: this.cm.$(li), match } : undefined;
      })
      .get() as ElementAndRegExpMatch[];
    return result[0] ?? undefined;
  }

  getHeaderMetadata(key: string): string | undefined {
    return this.getHeaderMetadataElementAndMatch(key)?.match[2].trim();
  }

  setHeaderMetadata(key: string, value: string): void {
    const res = this.getHeaderMetadataElementAndMatch(key);
    if (res) {
      this.cm.replaceText(res.element, `${res.match[1]}${value}`);
    } else {
      const ul = this.getHeaderMetadataUl();
      if (ul) {
        this.cm.appendToList(ul, `${key}: ${value}`);
      } else {
        const h1TitleElt = this.getFirstH1TitleElement();
        if (h1TitleElt) {
          this.cm.insertLineAfter(h1TitleElt, `\n- ${key}: ${value}\n`);
        } else {
          this.cm.insertLineAt(0, `- ${key}: ${value}`);
        }
      }
    }
  }

  deleteHeaderMetadata(key: string): void {
    // TODO: fix bug: when the last item is deleted, it deletes also the next new line.
    // As a result, it is not detected as a list anymore.
    const res = this.getHeaderMetadataElementAndMatch(key);
    if (res) {
      this.cm.deleteElement(res.element);
    }
  }

  private getLinksUl(): cheerio.Cheerio | undefined {
    const h2Results = this.cm
      .$("h2")
      .filter((i, elt) => this.cm.$(elt).text().toLowerCase() === "links");
    if (h2Results.length === 0) {
      return undefined;
    }
    const h2 = h2Results[0];
    const elts = this.cm.$(h2).nextUntil("h2");
    const ul = elts.filter("ul").first();
    return ul.length > 0 ? ul : undefined;
  }

  getLinks(): string[] | undefined {
    const ul = this.getLinksUl();
    if (!ul) {
      return undefined;
    }
    return ul
      .children()
      .map((i, li) => cheerioToMarkdown(this.cm.$(li), true))
      .get() as string[];
  }

  addLink(link: string): void {
    const ul = this.getLinksUl();
    if (ul === undefined) {
      this.cm.appendLine(`\n## Links\n\n- ${link}`);
    } else {
      this.cm.appendToList(ul, link);
    }
  }

  addLinkNoDuplicate(link: string): void {
    const links = this.getLinks();
    if (
      links &&
      links
        .map((l) => l.toLowerCase().trim())
        .filter((l) => l === link.toLowerCase().trim()).length > 0
    ) {
      return;
    }
    this.addLink(link);
  }

  getRawMarkdown(): string {
    return this.props.value;
  }

  clone(): MarkdownBody {
    const copy = new MarkdownBody(this.props.value);
    if (this.adrLinkResolver) {
      copy.setAdrLinkResolver(this.adrLinkResolver);
    }
    return copy;
  }

  async replaceAdrLinks(from: Adr): Promise<void> {
    if (!this.adrLinkResolver) {
      throw new Log4brainsError(
        "Impossible to call replaceAdrLinks() without an MarkdownAdrLinkResolver"
      );
    }

    const links = this.cm
      .$("a")
      .map((_, element) => ({
        text: this.cm.$(element).text(),
        href: this.cm.$(element).attr("href")
      }))
      .get() as Link[];

    const isUrlRegexp = new RegExp(/^https?:\/\//i);

    const promises = links
      .filter((link) => !isUrlRegexp.exec(link.href))
      .filter((link) => link.href.toLowerCase().endsWith(".md"))
      .map((link) =>
        (async () => {
          const mdAdrlink = await this.adrLinkResolver!.resolve(
            from,
            link.href
          );
          if (mdAdrlink) {
            const params = [
              `slug="${htmlentities(mdAdrlink.to.slug.value)}"`,
              `status="${mdAdrlink.to.status.name}"`
            ];
            if (mdAdrlink.to.title) {
              params.push(`title="${htmlentities(mdAdrlink.to.title)}"`);
            }
            if (mdAdrlink.to.package) {
              params.push(
                `package="${htmlentities(mdAdrlink.to.package.name)}"`
              );
            }
            this.cm.updateMarkdown(
              this.cm.markdown.replace(
                `[${link.text}](${link.href})`,
                `<AdrLink ${params.join(" ")} />`
              )
            );
          }
        })()
      );

    await Promise.all(promises);
  }
}

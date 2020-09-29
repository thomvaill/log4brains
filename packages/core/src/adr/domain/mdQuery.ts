import cheerio from "cheerio";
import MarkdownIt from "markdown-it";

const markdownItInstance = new MarkdownIt();

export type MdQuery = cheerio.Root;

export function mdQuery(markdown: string): MdQuery {
  return cheerio.load(markdownItInstance.render(markdown));
}

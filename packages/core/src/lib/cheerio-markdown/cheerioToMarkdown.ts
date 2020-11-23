import cheerio from "cheerio";

export function cheerioToMarkdown(
  elt: cheerio.Cheerio,
  keepLinks = true
): string {
  const html = elt.html();
  if (!html) {
    return "";
  }
  const copy = cheerio.load(html);

  if (keepLinks) {
    copy("a").each((i, linkElt) => {
      copy(linkElt).text(
        `[${copy(linkElt).text()}](${copy(linkElt).attr("href")})`
      );
    });
  }

  return copy("body").text();
}

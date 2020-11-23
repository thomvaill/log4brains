/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import MarkdownIt from "markdown-it";

// Source: https://github.com/tylingsoft/markdown-it-source-map
// Thanks! ;)
// Had to fork it to add additional information

export function markdownItSourceMap(md: MarkdownIt): void {
  const defaultRenderToken = md.renderer.renderToken.bind(md.renderer);
  md.renderer.renderToken = function (tokens, idx, options) {
    const token = tokens[idx];
    if (token.type.endsWith("_open")) {
      if (token.map) {
        token.attrPush(["data-source-line-start", token.map[0].toString()]);
        token.attrPush(["data-source-line-end", token.map[1].toString()]);
      }
      if (token.markup !== undefined) {
        token.attrPush(["data-source-markup", token.markup]);
      }
      if (token.level !== undefined) {
        token.attrPush(["data-source-level", token.level.toString()]);
      }
    }
    return defaultRenderToken(tokens, idx, options);
  };
}

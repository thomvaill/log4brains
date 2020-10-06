/* eslint-disable sonarjs/no-duplicate-string */
import {
  FolderReference,
  MarkdownAdrFilename,
  MarkdownBody
} from "./value-objects";
import { Adr } from "./Adr";

type BuildAdrRes = {
  filename: MarkdownAdrFilename;
  markdownBody: MarkdownBody;
  adr: Adr;
};

function buildAdr(filenameStr: string, markdownStr: string): BuildAdrRes {
  const folder = FolderReference.createRoot();
  const filename = new MarkdownAdrFilename(filenameStr);
  const markdownBody = new MarkdownBody(markdownStr);
  return {
    filename,
    markdownBody,
    adr: new Adr(folder, filename, markdownBody)
  };
}

describe("Adr", () => {
  it("creates a slug from the filename", () => {
    const { adr } = buildAdr("0001-My-ADR.md", "# Test");
    expect(adr.slug.value).toEqual("0001-My-ADR");
  });

  it("detects the ADR number from the filename", () => {
    const { adr } = buildAdr("0001-My-ADR.md", "# Test");
    expect(adr.number).toBeDefined();
    expect(adr.number?.value).toEqual(1);
  });

  it("created a warning when impossible to detect the ADR number", () => {
    const { adr } = buildAdr("My-ADR.md", "# Test");
    expect(adr.number).toBeUndefined();
    expect(adr.diagnostics).toHaveLength(1);
  });

  it("extracts the ADR title from the Markdown body", () => {
    const { adr } = buildAdr("0001-My-ADR.md", "# Test");
    expect(adr.title).toEqual("Test");
  });

  it("creates a warning when there is no H1 title in the Markdown body", () => {
    const { adr } = buildAdr("0001-My-ADR.md", "## Test");
    expect(adr.title).toBeUndefined();
    expect(adr.diagnostics).toHaveLength(1);
  });
});

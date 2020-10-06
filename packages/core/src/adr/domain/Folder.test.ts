import {
  AdrNumber,
  FolderReference,
  MarkdownAdrFilename,
  MarkdownBody
} from "./value-objects";
import { Adr } from "./Adr";
import { Folder } from "./Folder";

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

describe("Folder", () => {
  it("returns the ADRs by their numbers", () => {
    const { adr: adr1 } = buildAdr("0001-My-ADR.md", "# Test");
    const { adr: adr1bis } = buildAdr("0001-My-ADR-bis.md", "# Test bis");
    const { adr: adr2 } = buildAdr("0002-My-ADR-2.md", "# Test");

    const folder = new Folder(FolderReference.createRoot(), [
      adr1,
      adr1bis,
      adr2
    ]);

    expect(folder.adrs).toHaveLength(3);
    expect(folder.getAdrsByNumber(new AdrNumber(1))).toEqual([adr1, adr1bis]);
    expect(folder.getAdrsByNumber(new AdrNumber(2))).toEqual([adr2]);
  });

  it("handles ADR number duplicates with a warning", () => {
    const { adr: adr1 } = buildAdr("0001-My-ADR.md", "# Test");
    const { adr: adr1bis } = buildAdr("0001-My-ADR-bis.md", "# Test bis");
    const { adr: adr2 } = buildAdr("0002-My-ADR-2.md", "# Test");

    const folder = new Folder(FolderReference.createRoot(), [
      adr1,
      adr1bis,
      adr2
    ]);

    expect(folder.diagnostics).toHaveLength(1);
  });
});

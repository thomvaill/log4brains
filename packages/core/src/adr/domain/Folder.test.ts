/* eslint-disable no-underscore-dangle */
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
  const filename = MarkdownAdrFilename.createUnsafe(filenameStr);
  const markdownBody = MarkdownBody.create(markdownStr);
  return {
    filename,
    markdownBody,
    adr: Adr.create(folder, filename, markdownBody)._unsafeUnwrap()
  };
}

describe("Folder", () => {
  it("returns the ADRs by their numbers", () => {
    const { adr: adr1 } = buildAdr("0001-My-ADR.md", "# Test");
    const { adr: adr1bis } = buildAdr("0001-My-ADR-bis.md", "# Test bis");
    const { adr: adr2 } = buildAdr("0002-My-ADR-2.md", "# Test");

    const folder = Folder.create(FolderReference.createRoot(), [
      adr1,
      adr1bis,
      adr2
    ]);

    expect(folder.adrs).toHaveLength(3);
    expect(folder.getAdrsByNumber(AdrNumber.createUnsafe(1))).toEqual([
      adr1,
      adr1bis
    ]);
    expect(folder.getAdrsByNumber(AdrNumber.createUnsafe(2))).toEqual([adr2]);
  });

  it("handles ADR number duplicates with a warning", () => {
    const { adr: adr1 } = buildAdr("0001-My-ADR.md", "# Test");
    const { adr: adr1bis } = buildAdr("0001-My-ADR-bis.md", "# Test bis");
    const { adr: adr2 } = buildAdr("0002-My-ADR-2.md", "# Test");

    const folder = Folder.create(FolderReference.createRoot(), [
      adr1,
      adr1bis,
      adr2
    ]);

    expect(folder.hasErrors()).toBeTruthy();
  });
});

/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-underscore-dangle */
import { Result } from "neverthrow";
import {
  FolderReference,
  MarkdownAdrFilename,
  MarkdownBody
} from "./value-objects";
import { Adr } from "./Adr";
import { DomainError } from "./errors";

type BuildAdrRes = {
  filename: MarkdownAdrFilename;
  markdownBody: MarkdownBody;
  adrRes: Result<Adr, DomainError>;
};

function buildAdr(filenameStr: string, markdownStr: string): BuildAdrRes {
  const folder = FolderReference.createRoot();
  const filename = MarkdownAdrFilename.createUnsafe(filenameStr);
  const markdownBody = MarkdownBody.create(markdownStr);
  return {
    filename,
    markdownBody,
    adrRes: Adr.create(folder, filename, markdownBody)
  };
}

describe("Adr", () => {
  it("creates a slug from the filename", () => {
    const { adrRes } = buildAdr("0001-My-ADR.md", "# Test");
    expect(adrRes.isOk()).toBeTruthy();
    expect(adrRes._unsafeUnwrap().slug.value).toEqual("0001-My-ADR");
  });

  it("detects the ADR number from the filename", () => {
    const { adrRes } = buildAdr("0001-My-ADR.md", "# Test");
    expect(adrRes.isOk()).toBeTruthy();
    expect(adrRes._unsafeUnwrap().number.value).toEqual(1);
  });

  it("returns an error when impossible to detect the ADR number", () => {
    const { adrRes } = buildAdr("My-ADR.md", "# Test");
    expect(adrRes.isOk()).toBeFalsy();
  });

  it("extracts the ADR title from the Markdown body", () => {
    const { adrRes } = buildAdr("0001-My-ADR.md", "# Test");
    expect(adrRes.isOk()).toBeTruthy();
    expect(adrRes._unsafeUnwrap().title).toEqual("Test");
  });

  it("creates a warning when there is no H1 title in the Markdown body", () => {
    const { adrRes } = buildAdr("0001-My-ADR.md", "## Test");
    expect(adrRes.isOk()).toBeTruthy();
    expect(adrRes._unsafeUnwrap().title).toBeUndefined();
    expect(adrRes._unsafeUnwrap().hasErrors()).toBeTruthy();
  });
});

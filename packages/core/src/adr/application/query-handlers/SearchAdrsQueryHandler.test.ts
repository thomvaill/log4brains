import { mock, mockClear } from "jest-mock-extended";
import { AdrRepository } from "@src/adr/application";
import {
  Adr,
  AdrFile,
  AdrSlug,
  AdrStatus,
  FilesystemPath,
  MarkdownBody
} from "@src/adr/domain";
import { SearchAdrsQuery } from "../queries";
import { SearchAdrsQueryHandler } from "./SearchAdrsQueryHandler";

describe("SearchAdrsQueryHandler", () => {
  const adr1 = new Adr({
    slug: new AdrSlug("adr1"),
    file: new AdrFile(new FilesystemPath("/", "adr1.md")),
    body: new MarkdownBody("")
  });
  const adr2 = new Adr({
    slug: new AdrSlug("adr2"),
    file: new AdrFile(new FilesystemPath("/", "adr2.md")),
    body: new MarkdownBody("")
  });

  const adrRepository = mock<AdrRepository>();
  adrRepository.findAll.mockReturnValue(Promise.resolve([adr1, adr2]));

  const handler = new SearchAdrsQueryHandler({ adrRepository });

  beforeEach(() => {
    mockClear(adrRepository);
  });

  it("returns all ADRs when no filter", async () => {
    const adrs = await handler.execute(new SearchAdrsQuery({}));
    expect(adrs).toHaveLength(2);
  });

  it("filters the ADRs on their status", async () => {
    const adrs = await handler.execute(
      new SearchAdrsQuery({ statuses: [AdrStatus.createFromName("proposed")] })
    );
    expect(adrs).toHaveLength(0);
  });
});

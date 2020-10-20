import { AdrStatus } from "./AdrStatus";

describe("AdrStatus", () => {
  it("create from name", () => {
    const status = AdrStatus.createFromName("draft");
    expect(status.name).toEqual("draft");
  });

  it("throws when unknown name", () => {
    expect(() => {
      AdrStatus.createFromName("loremipsum");
    }).toThrow();
  });

  it("works with 'superseded by XXX", () => {
    const status = AdrStatus.createFromName("superseded by XXX");
    expect(status.name).toEqual("superseded");
  });
});

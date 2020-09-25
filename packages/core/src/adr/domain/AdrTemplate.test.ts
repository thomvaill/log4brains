import { Adr } from "./Adr";
import { AdrSlug } from "./AdrSlug";
import { AdrTemplate } from "./AdrTemplate";
import { MarkdownBody } from "./MarkdownBody";
import { PackageRef } from "./PackageRef";

describe("AdrTemplate", () => {
  beforeAll(() => {
    Adr.setTz("Etc/UTC");
  });
  afterAll(() => {
    Adr.clearTz();
  });

  const tplMarkdown = `# [short title of solved problem and solution]

  - Status: [draft | proposed | rejected | accepted | deprecated | … | superseded by [ADR-0005](0005-example.md)] <!-- optional -->
  - Deciders: [list everyone involved in the decision] <!-- optional -->
  - Date: [YYYY-MM-DD when the decision was last updated] <!-- optional - changes the order displayed in the UI -->

  Technical Story: [description | ticket/issue URL] <!-- optional -->

  ## Context and Problem Statement

  [Describe the context and problem statement, e.g., in free form using two to three sentences. You may want to articulate the problem in form of a question.]
`;

  it("creates an ADR from the template", () => {
    const template = new AdrTemplate({
      package: new PackageRef("test"),
      body: new MarkdownBody(tplMarkdown)
    });
    const adr = template.createAdrFromMe(
      new AdrSlug("test/20200101-hello-world"),
      "Hello World"
    );
    expect(adr.slug.value).toEqual("test/20200101-hello-world");
    expect(adr.title).toEqual("Hello World");
  });

  it("throws when package mismatch in slug", () => {
    expect(() => {
      const template = new AdrTemplate({
        package: new PackageRef("test"),
        body: new MarkdownBody(tplMarkdown)
      });
      template.createAdrFromMe(
        new AdrSlug("other-package/20200101-hello-world"),
        "Hello World"
      );
    }).toThrow();
  });
});

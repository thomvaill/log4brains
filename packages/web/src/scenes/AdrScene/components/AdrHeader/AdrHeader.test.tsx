import { AdrDtoStatus } from "@log4brains/core";
import React from "react";
import TestRenderer from "react-test-renderer";
import { AdrHeader } from "./AdrHeader";

describe("AdrHeader", () => {
  it("renders correctly with deciders", () => {
    const tree = TestRenderer.create(
      <AdrHeader
        adr={{
          slug: "test",
          package: "",
          title: "Test",
          status: "draft" as AdrDtoStatus,
          supersededBy: null,
          tags: [],
          deciders: ["John Doe", "Lorem Ipsum", "Ipsum Dolor"],
          body: {
            enhancedMdx: "# Test",
            rawMarkdown: "#Test"
          },
          creationDate: new Date(2020, 0, 1).toJSON(),
          lastEditDate: new Date(2020, 0, 1).toJSON(),
          lastEditAuthor: "John Doe",
          publicationDate: null,
          file: {
            relativePath: "test.md",
            absolutePath: "/test.md"
          }
        }}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("renders correctly without deciders", () => {
    const tree = TestRenderer.create(
      <AdrHeader
        adr={{
          slug: "test",
          package: "",
          title: "Test",
          status: "draft" as AdrDtoStatus,
          supersededBy: null,
          tags: [],
          deciders: [],
          body: {
            enhancedMdx: "# Test",
            rawMarkdown: "#Test"
          },
          creationDate: new Date(2020, 0, 1).toJSON(),
          lastEditDate: new Date(2020, 0, 1).toJSON(),
          lastEditAuthor: "John Doe",
          publicationDate: null,
          file: {
            relativePath: "test.md",
            absolutePath: "/test.md"
          }
        }}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("renders correctly with package", () => {
    const tree = TestRenderer.create(
      <AdrHeader
        adr={{
          slug: "test",
          package: "test",
          title: "Test",
          status: "draft" as AdrDtoStatus,
          supersededBy: null,
          tags: [],
          deciders: [],
          body: {
            enhancedMdx: "# Test",
            rawMarkdown: "#Test"
          },
          creationDate: new Date(2020, 0, 1).toJSON(),
          lastEditDate: new Date(2020, 0, 1).toJSON(),
          lastEditAuthor: "John Doe",
          publicationDate: null,
          file: {
            relativePath: "test.md",
            absolutePath: "/test.md"
          }
        }}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("renders correctly with tags", () => {
    const tree = TestRenderer.create(
      <AdrHeader
        adr={{
          slug: "test",
          package: "test",
          title: "Test",
          status: "draft" as AdrDtoStatus,
          supersededBy: null,
          tags: ["foo", "bar"],
          deciders: [],
          body: {
            enhancedMdx: "# Test",
            rawMarkdown: "#Test"
          },
          creationDate: new Date(2020, 0, 1).toJSON(),
          lastEditDate: new Date(2020, 0, 1).toJSON(),
          lastEditAuthor: "John Doe",
          publicationDate: null,
          file: {
            relativePath: "test.md",
            absolutePath: "/test.md"
          }
        }}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("renders correctly with publication date", () => {
    const tree = TestRenderer.create(
      <AdrHeader
        adr={{
          slug: "test",
          package: "test",
          title: "Test",
          status: "accepted" as AdrDtoStatus,
          supersededBy: null,
          tags: [],
          deciders: [],
          body: {
            enhancedMdx: "# Test",
            rawMarkdown: "#Test"
          },
          creationDate: new Date(2020, 0, 1).toJSON(),
          lastEditDate: new Date(2020, 0, 1).toJSON(),
          lastEditAuthor: "John Doe",
          publicationDate: new Date(2020, 0, 2).toJSON(),
          file: {
            relativePath: "test.md",
            absolutePath: "/test.md"
          }
        }}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("shows the Github repository button", () => {
    const tree = TestRenderer.create(
      <AdrHeader
        adr={{
          slug: "test",
          package: "test",
          title: "Test",
          status: "accepted" as AdrDtoStatus,
          supersededBy: null,
          tags: [],
          deciders: [],
          body: {
            enhancedMdx: "# Test",
            rawMarkdown: "#Test"
          },
          creationDate: new Date(2020, 0, 1).toJSON(),
          lastEditDate: new Date(2020, 0, 1).toJSON(),
          lastEditAuthor: "John Doe",
          publicationDate: new Date(2020, 0, 2).toJSON(),
          file: {
            relativePath: "test.md",
            absolutePath: "/test.md"
          },
          repository: {
            provider: "github",
            viewUrl: "https://github.com/xxx"
          }
        }}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("shows the Gitlab repository button", () => {
    const tree = TestRenderer.create(
      <AdrHeader
        adr={{
          slug: "test",
          package: "test",
          title: "Test",
          status: "accepted" as AdrDtoStatus,
          supersededBy: null,
          tags: [],
          deciders: [],
          body: {
            enhancedMdx: "# Test",
            rawMarkdown: "#Test"
          },
          creationDate: new Date(2020, 0, 1).toJSON(),
          lastEditDate: new Date(2020, 0, 1).toJSON(),
          lastEditAuthor: "John Doe",
          publicationDate: new Date(2020, 0, 2).toJSON(),
          file: {
            relativePath: "test.md",
            absolutePath: "/test.md"
          },
          repository: {
            provider: "gitlab",
            viewUrl: "https://gitlab.com/xxx"
          }
        }}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("shows the generic repository button", () => {
    const tree = TestRenderer.create(
      <AdrHeader
        adr={{
          slug: "test",
          package: "test",
          title: "Test",
          status: "accepted" as AdrDtoStatus,
          supersededBy: null,
          tags: [],
          deciders: [],
          body: {
            enhancedMdx: "# Test",
            rawMarkdown: "#Test"
          },
          creationDate: new Date(2020, 0, 1).toJSON(),
          lastEditDate: new Date(2020, 0, 1).toJSON(),
          lastEditAuthor: "John Doe",
          publicationDate: new Date(2020, 0, 2).toJSON(),
          file: {
            relativePath: "test.md",
            absolutePath: "/test.md"
          },
          repository: {
            provider: "generic",
            viewUrl: "https://foo.com/xxx"
          }
        }}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("shows the locally edit button", () => {
    const tree = TestRenderer.create(
      <AdrHeader
        adr={{
          slug: "test",
          package: "test",
          title: "Test",
          status: "accepted" as AdrDtoStatus,
          supersededBy: null,
          tags: [],
          deciders: [],
          body: {
            enhancedMdx: "# Test",
            rawMarkdown: "#Test"
          },
          creationDate: new Date(2020, 0, 1).toJSON(),
          lastEditDate: new Date(2020, 0, 1).toJSON(),
          lastEditAuthor: "John Doe",
          publicationDate: new Date(2020, 0, 2).toJSON(),
          file: {
            relativePath: "test.md",
            absolutePath: "/test.md"
          },
          repository: {
            provider: "generic",
            viewUrl: "https://foo.com/xxx"
          }
        }}
        locallyEditable
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

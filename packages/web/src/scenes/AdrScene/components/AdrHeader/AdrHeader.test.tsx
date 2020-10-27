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
            markdown: `# Test`
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
            markdown: `# Test`
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
            markdown: `# Test`
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
            markdown: `# Test`
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
            markdown: `# Test`
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
});

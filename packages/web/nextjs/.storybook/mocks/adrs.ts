import { AdrDtoStatus } from "@log4brains/core";
import { Adr } from "../../src/lib-shared/types";

export const adrMocks = [
  {
    slug: "20200101-use-markdown-architectural-decision-records",
    package: null,
    title: "Use Markdown Architectural Decision Records",
    status: "accepted" as AdrDtoStatus,
    supersededBy: null,
    tags: [],
    deciders: [],
    body: {
      enhancedMdx: `
## Context and Problem Statement

We want to record architectural decisions made in this project.
Which format and structure should these records follow?

## Considered Options

- [MADR](https://adr.github.io/madr/) 2.1.2 with log4brains patch
- [MADR](https://adr.github.io/madr/) 2.1.2 – The original Markdown Architectural Decision Records
- [Michael Nygard's template](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions) – The first incarnation of the term "ADR"
- [Sustainable Architectural Decisions](https://www.infoq.com/articles/sustainable-architectural-design-decisions) – The Y-Statements
- Other templates listed at <https://github.com/joelparkerhenderson/architecture_decision_record>
- Formless – No conventions for file format and structure

## Decision Outcome

Chosen option: "MADR 2.1.2 with log4brains patch", because

- Implicit assumptions should be made explicit.
  Design documentation is important to enable people understanding the decisions later on.
  See also [A rational design process: How and why to fake it](https://doi.org/10.1109/TSE.1986.6312940).
- The MADR format is lean and fits our development style.
- The MADR structure is comprehensible and facilitates usage & maintenance.
- The MADR project is vivid.
- Version 2.1.2 is the latest one available when starting to document ADRs.

The "log4brains patch" performs the following modifications to the original template:

- Add a draft status, to enable collaborative writing.
- Remove the Date field, because this metadata is already available in Git.
`
    },
    creationDate: new Date(2020, 1, 1).toJSON(),
    lastEditDate: new Date(2020, 10, 26).toJSON(),
    lastEditAuthor: "John Doe",
    publicationDate: new Date(2020, 1, 1).toJSON(),
    repository: {
      provider: "gitlab",
      viewUrl:
        "https://gitlab.com/foo/bar/-/blob/master/docs/adr/20200101-use-markdown-architectural-decision-records.md"
    }
  },
  {
    slug: "frontend/20200102-use-nextjs-for-static-site-generation",
    package: "frontend",
    title: "Use Next.js for Static Site Generation",
    status: "proposed" as AdrDtoStatus,
    supersededBy: null,
    tags: [],
    deciders: [],
    body: { enhancedMdx: "" },
    creationDate: new Date(2020, 1, 2).toJSON(),
    lastEditDate: new Date(2020, 10, 26).toJSON(),
    lastEditAuthor: "John Doe",
    publicationDate: null,
    repository: {
      provider: "github",
      viewUrl:
        "https://github.com/foo/bar/blob/master/docs/adr/20200102-use-nextjs-for-static-site-generation.md"
    }
  },
  {
    slug: "20200106-an-old-decision",
    package: null,
    title: "An old decision",
    status: "superseded" as AdrDtoStatus,
    supersededBy: "20200404-a-new-decision",
    tags: [],
    deciders: [],
    body: { enhancedMdx: "Test" },
    creationDate: new Date(2020, 1, 6).toJSON(),
    lastEditDate: new Date(2020, 1, 7).toJSON(),
    lastEditAuthor: "John Doe",
    publicationDate: new Date(2020, 1, 8).toJSON(),
    repository: {
      provider: "bitbucket",
      viewUrl:
        "https://bitbucket.org/foo/bar/src/master/docs/adr/20200106-an-old-decision.md"
    }
  },
  {
    slug: "20200404-a-new-decision",
    package: null,
    title: "An new decision",
    status: "accepted" as AdrDtoStatus,
    supersededBy: null,
    tags: [],
    deciders: [],
    body: {
      enhancedMdx: `## Lorem Ipsum

Ipsum Dolor

<AdrLink slug="20200106-an-old-decision" status="superseded" title="An old decision" customLabel="This is a link with a custom label" />

## Links

- Supersedes <AdrLink slug="20200106-an-old-decision" status="superseded" title="An old decision" />
`
    },
    creationDate: new Date(2020, 4, 4).toJSON(),
    lastEditDate: new Date(2020, 10, 26).toJSON(),
    lastEditAuthor: "John Doe",
    publicationDate: null,
    repository: {
      provider: "github",
      viewUrl:
        "https://github.com/foo/bar/blob/master/docs/adr/20200404-a-new-decision.md"
    }
  },
  {
    slug: "backend/20200404-untitled-draft",
    package: "backend",
    title: "Untitled Draft",
    status: "draft" as AdrDtoStatus,
    supersededBy: null,
    tags: [],
    deciders: [],
    body: { enhancedMdx: "" },
    creationDate: new Date(2020, 4, 4).toJSON(),
    lastEditDate: new Date(2020, 10, 26).toJSON(),
    lastEditAuthor: "John Doe",
    publicationDate: null,
    repository: {
      provider: "github",
      viewUrl:
        "https://github.com/foo/bar/blob/master/docs/adr/20200404-untitled-draft.md"
    }
  },
  {
    slug: "backend/20200405-lot-of-deciders",
    package: "backend",
    title: "Lot of deciders",
    status: "draft" as AdrDtoStatus,
    supersededBy: null,
    tags: [],
    deciders: [
      "John Doe",
      "Lorem Ipsum",
      "Ipsum Dolor",
      "Foo Bar",
      "John Doe",
      "Lorem Ipsum",
      "Ipsum Dolor",
      "Foo Bar",
      "John Doe",
      "Lorem Ipsum",
      "Ipsum Dolor",
      "Foo Bar"
    ],
    body: { enhancedMdx: "" },
    creationDate: new Date(2020, 4, 5).toJSON(),
    lastEditDate: new Date(2020, 10, 26).toJSON(),
    lastEditAuthor: "John Doe",
    publicationDate: null,
    repository: {
      provider: "generic",
      viewUrl:
        "https://custom.com/foo/bar/blob/master/docs/adr/20200405-lot-of-deciders.md"
    }
  },
  {
    slug: "backend/20200405-untitled-draft2",
    package: "backend",
    title:
      "This is a very long title for an ADR which should span on multiple lines but it does not matter",
    status: "draft" as AdrDtoStatus,
    supersededBy: null,
    tags: [],
    deciders: ["John Doe", "Lorem Ipsum", "Ipsum Dolor"],
    body: {
      enhancedMdx: `Hello World
`
    },
    creationDate: new Date(2020, 4, 5).toJSON(),
    lastEditDate: new Date(2020, 10, 26).toJSON(),
    lastEditAuthor: "John Doe",
    publicationDate: null,
    repository: {
      provider: "github",
      viewUrl:
        "https://github.com/foo/bar/blob/master/docs/adr/20200405-untitled-draft2.md"
    }
  }
];
adrMocks.reverse();

export function getMockedAdrBySlug(slug: string): Adr | undefined {
  return adrMocks.filter((adr) => adr.slug === slug).pop();
}

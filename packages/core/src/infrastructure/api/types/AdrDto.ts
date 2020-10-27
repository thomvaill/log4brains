export type AdrDtoStatus =
  | "draft"
  | "proposed"
  | "rejected"
  | "accepted"
  | "deprecated"
  | "superseded";

// Dates are string (Date.toJSON()) because because Next.js cannot serialize Date objects

export type AdrDto = Readonly<{
  slug: string; // Follows this pattern: <package name>/<sub slug> or just <sub slug> when the ADR does not belong to a specific package
  package: string | null; // Null when the ADR does not belong to a package
  title: string | null;
  status: AdrDtoStatus;
  supersededBy: string | null; // Optionally contains the target ADR slug when status === "superseded"
  tags: string[]; // Can be empty
  deciders: string[]; // Can be empty. In this case, it is encouraged to use lastEditAuthor as the only decider
  body: Readonly<{
    rawMarkdown: string;
    enhancedMdx: string;
  }>;
  creationDate: string; // Comes from Git or filesystem
  lastEditDate: string; // Comes from Git or filesystem
  lastEditAuthor: string; // Comes from Git (Git last author, or current Git user.name when unversioned, or "Anonymous" when Git is not installed)
  publicationDate: string | null; // Comes from the Markdown body
  file: Readonly<{
    relativePath: string;
    absolutePath: string;
  }>;
}>;

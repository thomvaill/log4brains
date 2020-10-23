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
  tags: string[];
  body: Readonly<{
    markdown: string;
  }>;
  creationDate: string; // comes from Git or filesystem
  lastEditDate: string; // comes from Git or filesystem
  lastEditAuthor: string | null; // comes from Git
  publicationDate: string | null; // come from the Markdown body
  file: Readonly<{
    relativePath: string;
    absolutePath: string;
  }>;
}>;

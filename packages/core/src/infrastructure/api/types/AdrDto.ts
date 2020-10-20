export type AdrDtoStatus =
  | "draft"
  | "proposed"
  | "rejected"
  | "accepted"
  | "deprecated"
  | "superseded";

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
  creationDate: Date;
  publicationDate: Date | null;
  file: Readonly<{
    relativePath: string;
    absolutePath: string;
  }>;
}>;

export type AdrDto = {
  folder: string | null;
  number: number | null;
  slug: string;
  title: string | null;
  body: {
    markdown: string;
  };
};

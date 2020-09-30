export type Adr = {
  slug: string;
  number: number;
  // creationDate: Date;
  // lastUpdateDate: Date;
  // authors: string[];
  title?: string;
  body: {
    markdown: string;
  };
};

import { Result } from "neverthrow";

export interface Log4brains {
  findAllAdrs(): Promise<Result<AdrDto[], Error>>;
}

export type AdrDto = {
  folder: string | null;
  number: number;
  slug: string;
  title: string | null;
  body: {
    markdown: string;
  };
};

import { AdrDto } from "@log4brains/core";

export type Adr = Omit<AdrDto, "file" | "body"> & {
  body: { enhancedMdx: string };
};

export type AdrLight = Pick<
  Adr,
  "slug" | "package" | "title" | "status" | "creationDate" | "publicationDate"
>;

export function toAdr(dto: AdrDto): Adr {
  const { file, ...adrWithoutFile } = dto;
  return {
    ...adrWithoutFile,
    body: {
      enhancedMdx: dto.body.enhancedMdx
    }
  };
}

export function toAdrLight(adr: AdrDto | Adr): AdrLight {
  return {
    slug: adr.slug,
    package: adr.package,
    title: adr.title,
    status: adr.status,
    creationDate: adr.creationDate,
    publicationDate: adr.publicationDate
  };
}

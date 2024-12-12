import { AdrDto } from "@log4brains/core";

export type Adr = Omit<AdrDto, "supersededBy" | "body"> & {
  supersededBy: AdrLight | null;
  body: { enhancedMdx: string };
};

export type AdrLight = Pick<
  Adr,
  "slug" | "package" | "title" | "status" | "creationDate" | "publicationDate"
>;

export function toAdrLight(adr: AdrDto | Adr | AdrLight): AdrLight {
  return {
    slug: adr.slug,
    package: adr.package,
    title: adr.title,
    status: adr.status,
    creationDate: adr.creationDate,
    publicationDate: adr.publicationDate
  };
}

export function toAdr(dto: AdrDto, superseder?: AdrLight): Adr {
  if (dto.supersededBy && !superseder) {
    throw new Error("You forgot to pass the superseder");
  }
  if (superseder && superseder.slug !== dto.supersededBy) {
    throw new Error(
      "The given superseder does not match the `supersededBy` field"
    );
  }

  return {
    ...dto,
    supersededBy: superseder ? toAdrLight(superseder) : null,
    body: {
      enhancedMdx: dto.body.enhancedMdx
    }
  };
}

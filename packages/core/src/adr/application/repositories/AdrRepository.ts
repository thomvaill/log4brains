import { Adr, AdrSlug, PackageRef } from "@src/adr/domain";

export interface AdrRepository {
  find(slug: AdrSlug): Promise<Adr>;
  findAll(): Promise<Adr[]>;
  generateAvailableSlug(title: string, packageRef?: PackageRef): AdrSlug;
  save(adr: Adr): Promise<void>;
}

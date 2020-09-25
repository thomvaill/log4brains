import { AdrTemplate, PackageRef } from "@src/adr/domain";

export interface AdrTemplateRepository {
  find(packageRef?: PackageRef): Promise<AdrTemplate>;
}

import { PackageRef } from "@src/adr/domain";
import { Query } from "@src/application";

export class GenerateAdrSlugFromTitleQuery extends Query {
  constructor(
    public readonly title: string,
    public readonly packageRef?: PackageRef
  ) {
    super();
  }
}

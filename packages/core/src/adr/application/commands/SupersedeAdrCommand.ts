import { AdrSlug } from "@src/adr/domain";
import { Command } from "@src/application";

export class SupersedeAdrCommand extends Command {
  constructor(
    public readonly supersededSlug: AdrSlug,
    public readonly supersederSlug: AdrSlug
  ) {
    super();
  }
}

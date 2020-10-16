import { AdrSlug } from "@src/adr/domain";
import { Command } from "@src/application";

export class CreateAdrFromTemplateCommand extends Command {
  constructor(public readonly slug: AdrSlug, public readonly title: string) {
    super();
  }
}

import { PackageRef } from "@src/adr/domain";
import { CommandHandler } from "@src/application";
import { CreateAdrFromTemplateCommand } from "../commands";
import { AdrRepository, AdrTemplateRepository } from "../repositories";

type Deps = {
  adrRepository: AdrRepository;
  adrTemplateRepository: AdrTemplateRepository;
};

export class CreateAdrFromTemplateCommandHandler
  implements CommandHandler<CreateAdrFromTemplateCommand> {
  readonly commandClass = CreateAdrFromTemplateCommand;

  private readonly adrRepository: AdrRepository;

  private readonly adrTemplateRepository: AdrTemplateRepository;

  constructor({ adrRepository, adrTemplateRepository }: Deps) {
    this.adrRepository = adrRepository;
    this.adrTemplateRepository = adrTemplateRepository;
  }

  async execute(command: CreateAdrFromTemplateCommand): Promise<void> {
    const packageRef = command.slug.packagePart
      ? new PackageRef(command.slug.packagePart)
      : undefined;
    const template = await this.adrTemplateRepository.find(packageRef);
    const adr = template.createAdrFromMe(command.slug, command.title);
    await this.adrRepository.save(adr);
  }
}

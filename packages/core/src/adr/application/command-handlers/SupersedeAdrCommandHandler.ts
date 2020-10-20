import { CommandHandler } from "@src/application";
import { SupersedeAdrCommand } from "../commands";
import { AdrRepository } from "../repositories";

type Deps = {
  adrRepository: AdrRepository;
};

export class SupersedeAdrCommandHandler
  implements CommandHandler<SupersedeAdrCommand> {
  readonly commandClass = SupersedeAdrCommand;

  private readonly adrRepository: AdrRepository;

  constructor({ adrRepository }: Deps) {
    this.adrRepository = adrRepository;
  }

  async execute(command: SupersedeAdrCommand): Promise<void> {
    const supersededAdr = await this.adrRepository.find(command.supersededSlug);
    const supersederAdr = await this.adrRepository.find(command.supersederSlug);
    supersededAdr.supersedeBy(supersederAdr);
    await this.adrRepository.save(supersededAdr);
    await this.adrRepository.save(supersederAdr);
  }
}

import { RESOLVER } from "awilix";
import { Adr } from "adr/domain/Adr";
import { AdlRepository } from "../repositories";

type ConstructorOpts = {
  adlRepository: AdlRepository;
};

export class FindAllAdrs {
  static [RESOLVER] = {}; // tells Awilix to automatically register this class

  private readonly adlRepository: AdlRepository;

  constructor({ adlRepository }: ConstructorOpts) {
    this.adlRepository = adlRepository;
  }

  async execute(): Promise<Adr[]> {
    const adl = await this.adlRepository.load();
    return adl.adrs;
  }
}

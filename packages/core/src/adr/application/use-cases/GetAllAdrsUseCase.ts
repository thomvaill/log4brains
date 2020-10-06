import { RESOLVER } from "awilix";
import { Adr } from "@src/adr/domain/Adr";
import { AdrUseCaseBase } from "./AdrUseCaseBase";

export class GetAllAdrsUseCase extends AdrUseCaseBase {
  static [RESOLVER] = {}; // tells Awilix to automatically register this class

  async execute(): Promise<Adr[]> {
    const folders = await this.getFolders();
    return folders.map((folder) => folder.adrs).flat();
  }
}

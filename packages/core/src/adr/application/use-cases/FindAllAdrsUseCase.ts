import { Result, err, ok } from "neverthrow";
import { RESOLVER } from "awilix";
import { Adr } from "adr/domain/Adr";
import { AdrUseCase } from "./AdrUseCase";

export class FindAllAdrsUseCase extends AdrUseCase {
  static [RESOLVER] = {}; // tells Awilix to automatically register this class

  async execute(): Promise<Result<Adr[], Error>> {
    const foldersRes = await this.getFolders();
    if (foldersRes.isErr()) {
      return err(foldersRes.error);
    }
    return ok(foldersRes.value.map((folder) => folder.adrs).flat());
  }
}

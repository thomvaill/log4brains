import { RESOLVER } from "awilix";
import { Diagnostic } from "@src/adr/domain/diagnostics";
import { AdrUseCaseBase } from "./AdrUseCaseBase";

export class GetAllDiagnosticsUseCase extends AdrUseCaseBase {
  static [RESOLVER] = {}; // tells Awilix to automatically register this class

  async execute(): Promise<Diagnostic[]> {
    const folders = await this.getFolders();
    return folders
      .map((folder) => folder.getSelfAndChildrenDiagnostics())
      .flat();
  }
}

import { AwilixContainer } from "awilix";
import {
  buildConfigFromWorkdir,
  Log4brainsConfig
} from "@src/infrastructure/config";
import { buildContainer, ICradle } from "@src/infrastructure/di";
import { Project } from "@src/adr/domain";
import { AdrDto, DiagnosticDto } from "./types";
import { adrToDto, diagnosticToDto } from "./transformers";

/**
 * Log4brains core API.
 * Use {@link Log4brains.create} to build an instance.
 */
export class Log4brains {
  private readonly container: AwilixContainer<ICradle>;

  private constructor(config: Log4brainsConfig, workdir = ".") {
    this.container = buildContainer(config, workdir);

    // Explicitly resolve the Project now, to throw Errors if there are some
    this.container.resolve<Project>("adrProject");
  }

  /**
   * Returns all the ADRs from the project (root folder and sub folders).
   *
   * @throws {@link Log4brainsError}
   * In case of a non-recoverable error.
   */
  async getAdrs(): Promise<AdrDto[]> {
    const adrs = await this.container.cradle.getAllAdrsUseCase.execute();
    return adrs.map(adrToDto);
  }

  /**
   * Returns all the diagnostics from the project after trying to parse everything (root folder and sub folders).
   *
   * @throws {@link Log4brainsError}
   * In case of a non-recoverable error.
   */
  async getDiagnostics(): Promise<DiagnosticDto[]> {
    const diagnostics = await this.container.cradle.getAllDiagnosticsUseCase.execute();
    return diagnostics.map(diagnosticToDto);
  }

  /**
   * Creates an instance of the Log4brains API.
   *
   * @param workdir Path to working directory (ie. where ".log4brains.yml" is located)
   *
   * @throws {@link Log4brainsError}
   * In case of missing or invalid config file.
   */
  static create(workdir = "."): Log4brains {
    return new Log4brains(buildConfigFromWorkdir(workdir), workdir);
  }
}

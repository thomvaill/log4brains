import { AwilixContainer } from "awilix";
import { buildContainer } from "@src/infrastructure/di";
import { Adr, AdrSlug, AdrStatus, PackageRef } from "@src/adr/domain";
import {
  CreateAdrFromTemplateCommand,
  SupersedeAdrCommand
} from "@src/adr/application/commands";
import {
  SearchAdrsQuery,
  SearchAdrsFilters as AppSearchAdrsFilters,
  GenerateAdrSlugFromTitleQuery,
  AdrRepository
} from "@src/adr/application";
import { buildConfigFromWorkdir, Log4brainsConfig } from "../config";
import { AdrDto, AdrDtoStatus } from "./types";
import { adrToDto } from "./transformers";
import { CommandBus, QueryBus } from "../buses";

export type SearchAdrsFilters = {
  statuses?: AdrDtoStatus[];
};

/**
 * Log4brains core API.
 * Use {@link Log4brains.create} to build an instance.
 */
export class Log4brains {
  private readonly container: AwilixContainer;

  private readonly commandBus: CommandBus;

  private readonly queryBus: QueryBus;

  private readonly adrRepository: AdrRepository;

  private constructor(
    public readonly config: Log4brainsConfig,
    public readonly workdir = "."
  ) {
    this.container = buildContainer(config, workdir);
    this.commandBus = this.container.resolve<CommandBus>("commandBus");
    this.queryBus = this.container.resolve<QueryBus>("queryBus");
    this.adrRepository = this.container.resolve<AdrRepository>("adrRepository");
  }

  /**
   * Returns the ADRs which match the given search filters.
   * Returns all the ADRs of the project if no filter is given.
   * The results are sorted with this order priority:
   *  1. By the Date field from the markdown file (if available)
   *  2. By the Git creation date (does not follow renames)
   *  3. By slug
   *
   * @param filters Optional. Filters to apply to the search
   *
   * @throws {@link Log4brainsError}
   * In case of a non-recoverable error.
   */
  async searchAdrs(filters?: SearchAdrsFilters): Promise<AdrDto[]> {
    const appFilters: AppSearchAdrsFilters = {};
    if (filters?.statuses) {
      appFilters.statuses = filters.statuses.map((status) =>
        AdrStatus.createFromName(status)
      );
    }
    const adrs = await this.queryBus.dispatch<Adr[]>(
      new SearchAdrsQuery(appFilters)
    );

    return Promise.all(adrs.map(adrToDto));
  }

  /**
   * Generates an available ADR slug for the given title and package.
   * Format: [package-name/]yyyymmdd-slugified-lowercased-title
   *
   * @param title The title of the ADR
   * @param packageName Optional. The package name of the ADR.
   *
   * @throws {@link Log4brainsError}
   * In case of a non-recoverable error.
   */
  async generateAdrSlug(title: string, packageName?: string): Promise<string> {
    const packageRef = packageName ? new PackageRef(packageName) : undefined;
    return (
      await this.queryBus.dispatch<AdrSlug>(
        new GenerateAdrSlugFromTitleQuery(title, packageRef)
      )
    ).value;
  }

  /**
   * Creates a new ADR with the given slug and title with the default template.
   * @param slug The slug of the ADR
   * @param title The title of the ADR
   *
   * @throws {@link Log4brainsError}
   * In case of a non-recoverable error.
   */
  async createAdrFromTemplate(slug: string, title: string): Promise<AdrDto> {
    const slugObj = new AdrSlug(slug);
    await this.commandBus.dispatch(
      new CreateAdrFromTemplateCommand(slugObj, title)
    );
    return adrToDto(await this.adrRepository.find(slugObj));
  }

  /**
   * Supersede an ADR with another one.
   * @param supersededSlug Slug of the superseded ADR
   * @param supersederSlug Slug of the superseder ADR
   *
   * @throws {@link Log4brainsError}
   * In case of a non-recoverable error.
   */
  async supersedeAdr(
    supersededSlug: string,
    supersederSlug: string
  ): Promise<void> {
    const supersededSlugObj = new AdrSlug(supersededSlug);
    const supersederSlugObj = new AdrSlug(supersederSlug);
    await this.commandBus.dispatch(
      new SupersedeAdrCommand(supersededSlugObj, supersederSlugObj)
    );
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

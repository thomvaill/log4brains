import { AwilixContainer } from "awilix";
import { buildContainer } from "@src/infrastructure/di";
import open from "open";
import launchEditor from "launch-editor";
import { Adr, AdrSlug, AdrStatus, PackageRef } from "@src/adr/domain";
import {
  CreateAdrFromTemplateCommand,
  SupersedeAdrCommand
} from "@src/adr/application/commands";
import {
  SearchAdrsQuery,
  SearchAdrsFilters as AppSearchAdrsFilters,
  GenerateAdrSlugFromTitleQuery,
  AdrRepository,
  GetAdrBySlugQuery
} from "@src/adr/application";
import { Log4brainsError } from "@src/domain";
import {
  buildConfigFromWorkdir,
  Log4brainsConfig,
  findWorkdirRecursive
} from "../config";
import { AdrDto, AdrDtoStatus } from "./types";
import { adrToDto } from "./transformers";
import { CommandBus, QueryBus } from "../buses";
import { FileWatcher } from "../file-watcher";

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

    // @see Adr.tz
    Adr.setTz(config.project.tz);
  }

  /**
   * Returns the ADRs which match the given search filters.
   * Returns all the ADRs of the project if no filter is given.
   * The results are sorted with this order priority (ASC):
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
    return Promise.all(
      adrs.map((adr) => adrToDto(adr, this.config.project.repository))
    );
  }

  /**
   * Returns an ADR by its slug.
   *
   * @param slug ADR slug
   *
   * @throws {@link Log4brainsError}
   * In case of a non-recoverable error.
   */
  async getAdrBySlug(slug: string): Promise<AdrDto | undefined> {
    const adr = await this.queryBus.dispatch<Adr | undefined>(
      new GetAdrBySlugQuery(new AdrSlug(slug))
    );
    return adr ? adrToDto(adr, this.config.project.repository) : undefined;
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
   * Opens the given ADR in an editor on the local machine.
   * Tries first to guess the preferred editor of the user thanks to https://github.com/yyx990803/launch-editor.
   * If impossible to guess, uses xdg-open (or similar, depending on the OS, thanks to https://github.com/sindresorhus/open) as a fallback.
   * The overall order is thus the following:
   *  1) The currently running editor among the supported ones by launch-editor
   *  2) The editor defined by the $VISUAL environment variable
   *  3) The editor defined by the $EDITOR environment variable
   *  4) Fallback: xdg-open or similar
   *
   * @param slug The ADR slug to open
   * @param onImpossibleToGuess Optional. Callback called when the fallback method is used.
   *                             Useful to display a warning to the user to tell him to set his $VISUAL environment variable for the next time.
   *
   * @throws {@link Log4brainsError}
   * If the ADR does not exist or if even the fallback method fails.
   */
  async openAdrInEditor(
    slug: string,
    onImpossibleToGuess?: () => void
  ): Promise<void> {
    const adr = await this.queryBus.dispatch<Adr | undefined>(
      new GetAdrBySlugQuery(new AdrSlug(slug))
    );
    if (!adr) {
      throw new Log4brainsError("This ADR does not exist", slug);
    }
    const { file } = adr;
    if (!file) {
      throw new Log4brainsError(
        "You are trying to open an non-saved ADR",
        slug
      );
    }

    launchEditor(file.path.absolutePath, undefined, async () => {
      await open(file.path.absolutePath);
      if (onImpossibleToGuess) {
        onImpossibleToGuess();
      }
    });
  }

  /**
   * Returns a singleton instance of FileWatcher.
   * Useful for Hot Reloading.
   * @see FileWatcher
   */
  get fileWatcher(): FileWatcher {
    return this.container.resolve<FileWatcher>("fileWatcher");
  }

  /**
   * Creates an instance of the Log4brains API.
   *
   * @param workdir Path to working directory (ie. where ".log4brains.yml" is located)
   *
   * @throws {@link Log4brainsConfigNotFoundError}
   * In case of missing config file.
   *
   * @throws {@link Log4brainsError}
   * In case of invalid config file or other domain error.
   */
  static create(workdir = "."): Log4brains {
    return new Log4brains(buildConfigFromWorkdir(workdir), workdir);
  }

  /**
   * Creates an instance of the Log4brains API from a working directory.
   * The real working directory (ie. where ".log4brains.yml" is located) will be guessed looking in the parent directories.
   *
   * @param cwd Current working directory
   *
   * @throws {@link Log4brainsConfigNotFoundError}
   * In case of missing config file.
   *
   * @throws {@link Log4brainsError}
   * In case of invalid config file or other domain error.
   */
  static createFromCwd(cwd = "."): Log4brains {
    const workdir = findWorkdirRecursive(cwd);
    return Log4brains.create(workdir);
  }
}

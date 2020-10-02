import { Result, ok, err } from "neverthrow";
import { AwilixContainer } from "awilix";
import {
  buildConfigFromWorkdir,
  Log4brainsConfig
} from "infrastructure/config";
import { buildContainer, ICradle } from "infrastructure/di";
import { Project } from "adr/domain";
import { AdrDto, Log4brains } from "types";

class Log4brainsImpl implements Log4brains {
  private readonly container: AwilixContainer<ICradle>;

  constructor(config: Log4brainsConfig, workdir = ".") {
    this.container = buildContainer(config, workdir);
    this.container.resolve<Project>("adrProject"); // can throw an Error
  }

  async findAllAdrs(): Promise<Result<AdrDto[], Error>> {
    const res = await this.container.cradle.findAllAdrsUseCase.execute();
    if (res.isErr()) {
      return err(res.error);
    }
    return ok(
      // TODO: create an AdrDto factory
      res.value.map((adr) => ({
        folder: adr.folder.root ? null : adr.folder.name || null,
        number: adr.number.value,
        slug: adr.slug.value,
        title: adr.title || null,
        body: {
          markdown: adr.body.getRawMarkdown()
        }
      }))
    );
  }
}

export function getInstance(workdir = "."): Result<Log4brains, Error> {
  const config = buildConfigFromWorkdir(workdir);
  if (config.isErr()) {
    return err(config.error);
  }

  try {
    const instance = new Log4brainsImpl(config.value, workdir);
    return ok(instance);
  } catch (e) {
    return err(e);
  }
}

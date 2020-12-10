import { Log4brainsError } from "@src/domain";
import chokidar, { FSWatcher } from "chokidar";
import { Log4brainsConfig } from "../config";

export type FileWatcherEventType =
  | "add"
  | "addDir"
  | "change"
  | "unlink"
  | "unlinkDir";

export type FileWatcherEvent = {
  type: FileWatcherEventType;
  relativePath: string;
};

export type FileWatcherObserver = (event: FileWatcherEvent) => void;
export type FileWatcherUnsubscribeCb = () => void;

type Deps = {
  config: Log4brainsConfig;
  workdir: string;
};

/**
 * Watch files located in the main ADR folder, and in each package's ADR folder.
 * Useful for Hot Reloading.
 * The caller is responsible for starting and stopping it!
 */
export class FileWatcher {
  private readonly config: Log4brainsConfig;

  private readonly workdir: string;

  private chokidar: FSWatcher | undefined;

  private observers: Set<FileWatcherObserver> = new Set<FileWatcherObserver>();

  constructor({ config, workdir }: Deps) {
    this.workdir = workdir;
    this.config = config;
  }

  subscribe(cb: FileWatcherObserver): FileWatcherUnsubscribeCb {
    this.observers.add(cb);
    return () => {
      this.observers.delete(cb);
    };
  }

  start(): void {
    if (this.chokidar) {
      throw new Log4brainsError("FileWatcher is already started");
    }

    const paths = [
      this.config.project.adrFolder,
      ...(this.config.project.packages || []).map((pkg) => pkg.adrFolder)
    ];
    this.chokidar = chokidar
      .watch(paths, {
        ignoreInitial: true,
        cwd: this.workdir,
        disableGlobbing: true
      })
      .on("all", (event, filePath) => {
        this.observers.forEach((observer) =>
          observer({
            type: event,
            relativePath: filePath
          })
        );
      });
  }

  async stop(): Promise<void> {
    if (!this.chokidar) {
      throw new Log4brainsError("FileWatcher is not started");
    }
    await this.chokidar.close();
    this.chokidar = undefined;
  }
}

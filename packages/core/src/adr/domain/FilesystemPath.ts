import path from "path";
import { Log4brainsError, ValueObject } from "@src/domain";

type Props = {
  cwdAbsolutePath: string;
  pathRelativeToCwd: string;
};

export class FilesystemPath extends ValueObject<Props> {
  constructor(cwdAbsolutePath: string, pathRelativeToCwd: string) {
    super({ cwdAbsolutePath, pathRelativeToCwd });

    if (!path.isAbsolute(cwdAbsolutePath)) {
      throw new Log4brainsError("CWD path is not absolute", cwdAbsolutePath);
    }
  }

  get cwdAbsolutePath(): string {
    return this.props.cwdAbsolutePath;
  }

  get pathRelativeToCwd(): string {
    return this.props.pathRelativeToCwd;
  }

  get absolutePath(): string {
    return path.join(this.props.cwdAbsolutePath, this.pathRelativeToCwd);
  }

  get basename(): string {
    return path.basename(this.pathRelativeToCwd);
  }

  get extension(): string {
    // with the dot (.)
    return path.extname(this.pathRelativeToCwd);
  }

  get basenameWithoutExtension(): string {
    if (!this.extension) {
      return this.basename;
    }
    return this.basename.substring(
      0,
      this.basename.length - this.extension.length
    );
  }
}

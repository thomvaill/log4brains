import { ValueObject } from "@src/domain";

type Props = {
  root: boolean;
  name?: string;
};

export class FolderReference extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  get root(): boolean {
    return this.props.root;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  static createRoot(): FolderReference {
    return new FolderReference({
      root: true
    });
  }

  static create(name: string): FolderReference {
    return new FolderReference({ root: false, name });
  }
}

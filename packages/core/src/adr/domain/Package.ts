import { Entity } from "@src/domain";
import { FilesystemPath } from "./FilesystemPath";
import { PackageRef } from "./PackageRef";

type Props = {
  ref: PackageRef;
  path: FilesystemPath;
  adrFolderPath: FilesystemPath;
};

export class Package extends Entity<Props> {
  get ref(): PackageRef {
    return this.props.ref;
  }

  get path(): FilesystemPath {
    return this.props.path;
  }

  get adrFolderPath(): FilesystemPath {
    return this.props.adrFolderPath;
  }
}

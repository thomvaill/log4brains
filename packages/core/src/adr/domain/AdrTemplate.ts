import { AggregateRoot, Log4brainsError } from "@src/domain";
import { Adr } from "./Adr";
import { AdrSlug } from "./AdrSlug";
import { MarkdownBody } from "./MarkdownBody";
import { PackageRef } from "./PackageRef";

type Props = {
  package?: PackageRef;
  body: MarkdownBody;
};

export class AdrTemplate extends AggregateRoot<Props> {
  get package(): PackageRef | undefined {
    return this.props.package;
  }

  get body(): MarkdownBody {
    return this.props.body;
  }

  createAdrFromMe(slug: AdrSlug, title: string): Adr {
    const packageRef = slug.packagePart
      ? new PackageRef(slug.packagePart)
      : undefined;
    if (
      (!this.package && packageRef) ||
      (this.package && !this.package.equals(packageRef))
    ) {
      throw new Log4brainsError(
        "The given slug does not match this template package name",
        `slug: ${slug.value} / template package: ${this.package?.name}`
      );
    }
    const adr = new Adr({
      slug,
      package: packageRef,
      body: this.body.clone()
    });
    adr.setTitle(title);
    return adr;
  }
}

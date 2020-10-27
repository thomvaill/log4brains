import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Link as MuiLink } from "@material-ui/core";
import Link from "next/link";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // TODO: refactor with AdrMenu.tsx
    draftLink: {},
    proposedLink: {},
    acceptedLink: {},
    rejectedLink: {
      textDecoration: "line-through"
    },
    deprecatedLink: {
      textDecoration: "line-through"
    },
    supersededLink: {
      textDecoration: "line-through"
    }
  })
);

type AdrLinkProps = {
  slug: string;
  status: AdrDtoStatus;
  package?: string;
  title?: string;
};

export function AdrLink({
  slug,
  status,
  package: packageName,
  title
}: AdrLinkProps) {
  const classes = useStyles();

  return (
    <Link href={`/adr/${slug}`} passHref>
      <MuiLink
        className={clsx({
          [classes[`${status}Link` as keyof typeof classes]]: true
        })}
      >
        {title || "Untitled"}
      </MuiLink>
    </Link>
  );
}

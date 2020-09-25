import React from "react";
import { AdrDtoStatus } from "@log4brains/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Link as MuiLink } from "@material-ui/core";
import Link from "next/link";
import clsx from "clsx";

const useStyles = makeStyles(() =>
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
  // eslint-disable-next-line react/no-unused-prop-types
  package?: string;
  title?: string;
  customLabel?: string;
};

export function AdrLink({ slug, status, title, customLabel }: AdrLinkProps) {
  const classes = useStyles();

  return (
    <Link href={`/adr/${slug}`} passHref>
      <MuiLink
        className={clsx({
          [classes[`${status}Link` as keyof typeof classes]]: true
        })}
      >
        {customLabel || title || "Untitled"}
      </MuiLink>
    </Link>
  );
}

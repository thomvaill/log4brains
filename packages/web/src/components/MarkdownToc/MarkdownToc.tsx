import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Link as MuiLink, Typography } from "@material-ui/core";
import clsx from "clsx";
import {
  Toc as TocModel,
  TocBuilder as TocModelBuilder
} from "../../lib/toc-utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > ul": {
        padding: "0 !important"
      }
    },
    title: {
      fontWeight: theme.typography.fontWeightBold,
      paddingBottom: theme.spacing(1)
    },
    tocUl: {
      listStyleType: "none",
      paddingLeft: "1rem"
    }
  })
);

function variantToLevel(variant: string): number {
  return parseInt(variant.replace("h", ""), 10);
}

function buildTocModelFromContent(
  content: JSX.Element[] | JSX.Element,
  levelStart = 1
): TocModel {
  const builder = new TocModelBuilder();
  (Array.isArray(content) ? content : [content]).forEach((element) => {
    if (
      typeof element.type === "function" &&
      element.type.name === "MarkdownHeading"
    ) {
      builder.addSection(
        variantToLevel(element.props.variant) - levelStart + 1,
        element.props.children,
        element.props.id
      );
    }
  });

  return builder.getToc();
}

type TocSectionProps = {
  className?: string;
  children: React.ReactNode;
  title: string;
  id: string;
};

function TocSection({ title, id, children }: TocSectionProps) {
  const classes = useStyles();

  return (
    <li>
      <MuiLink href={`#${id}`}>{title}</MuiLink>
      {children ? <ul className={classes.tocUl}>{children}</ul> : null}
    </li>
  );
}

export type MarkdownTocProps = {
  className?: string;
  content?: JSX.Element[] | JSX.Element;
  levelStart?: number;
};

export function MarkdownToc({
  className,
  content,
  levelStart = 1
}: MarkdownTocProps) {
  const classes = useStyles();

  if (!content) {
    return null;
  }

  const model = buildTocModelFromContent(content, levelStart);
  if (model.children.length === 0) {
    return null;
  }

  return (
    <div className={clsx(classes.root, className)}>
      <Typography variant="subtitle2" className={classes.title}>
        Table of contents
      </Typography>
      <ul className={classes.tocUl}>
        {model.render((title: string, id: string, children: JSX.Element[]) => (
          <TocSection title={title} id={id} key={id}>
            {children}
          </TocSection>
        ))}
      </ul>
    </div>
  );
}

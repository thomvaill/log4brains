import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {
  Typography,
  TypographyClassKey,
  Link as MuiLink
} from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:hover": {
        "& $link": {
          visibility: "visible"
        }
      }
    },
    link: {
      marginLeft: "0.3ch",
      color: "inherit",
      "&:hover": {
        color: theme.palette.primary.main
      },
      visibility: "hidden"
    }
  })
);

export type MarkdownHeadingProps = {
  children: string;
  id: string;
  variant: "h1" | "h2" | "h3" | "h4";
  className?: string;
};

export function MarkdownHeading({
  id,
  children,
  variant,
  className
}: MarkdownHeadingProps) {
  const classes = useStyles();

  let typographyVariant: TypographyClassKey;
  switch (variant) {
    case "h1":
      typographyVariant = "h3";
      break;
    case "h2":
      typographyVariant = "h4";
      break;
    case "h3":
      typographyVariant = "h5";
      break;
    case "h4":
      typographyVariant = "h6";
      break;
    default:
      typographyVariant = "h6";
      break;
  }

  return (
    <Typography
      gutterBottom
      variant={typographyVariant}
      component={variant}
      id={id}
      className={clsx(classes.root, className)}
    >
      {children}
      <MuiLink href={`#${id}`} className={classes.link} title="Permanent link">
        ¶
      </MuiLink>
    </Typography>
  );
}

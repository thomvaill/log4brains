import React from "react";
import { Chip } from "@material-ui/core";
import {
  grey,
  indigo,
  deepOrange,
  lightGreen,
  brown
} from "@material-ui/core/colors";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import type { AdrDtoStatus } from "@log4brains/core";
import clsx from "clsx";

// Styles are inspired by the MUI "Badge" styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: "0.74rem",
      fontWeight: theme.typography.fontWeightMedium,
      height: "18px",
      verticalAlign: "text-bottom"
    },
    label: {
      padding: "0 6px"
    },
    draft: {
      color: grey[800]
    },
    proposed: {
      color: indigo[800]
    },
    rejected: {
      color: deepOrange[800]
    },
    accepted: {
      color: lightGreen[800]
    },
    deprecated: {
      color: brown[600]
    },
    superseded: {
      color: brown[600]
    }
  })
);

export type AdrStatusChipProps = {
  className?: string;
  status: AdrDtoStatus;
};

export function AdrStatusChip({ className, status }: AdrStatusChipProps) {
  const classes = useStyles();
  return (
    <Chip
      variant="outlined"
      size="small"
      label={status.toUpperCase()}
      className={clsx(className, classes.root, classes[status])}
      classes={{ labelSmall: classes.label }}
    />
  );
}

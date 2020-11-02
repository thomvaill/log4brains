import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import clsx from "clsx";
import { CustomTheme } from "../../mui";

const useStyles = makeStyles((theme: CustomTheme) =>
  createStyles({
    root: {
      display: "flex"
    },
    layoutLeftCol: {
      flexGrow: 1
    },
    layoutCenterCol: {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: theme.custom.layout.centerColBasis
    },
    layoutRightCol: {
      flexGrow: 1,
      flexBasis: theme.custom.layout.rightColBasis
    },
    rightCol: {
      position: "sticky",
      top: theme.spacing(14), // TODO: calculate it based on AdrBrowserLayout's topSpace var
      alignSelf: "flex-start",
      paddingLeft: theme.spacing(6)
    }
  })
);

type TwoColContentProps = {
  className?: string;
  children: React.ReactNode;
  rightColContent?: React.ReactNode;
};

export function TwoColContent({
  className,
  children,
  rightColContent
}: TwoColContentProps) {
  const classes = useStyles();

  return (
    <div className={clsx(className, classes.root)}>
      <div className={classes.layoutLeftCol} />
      <div className={classes.layoutCenterCol}>{children}</div>
      <div className={clsx(classes.layoutRightCol, classes.rightCol)}>
        {rightColContent}
      </div>
    </div>
  );
}

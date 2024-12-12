import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { CustomTheme } from "../../mui";

const useStyles = makeStyles((theme: CustomTheme) =>
  createStyles({
    root: {
      display: "flex"
    },
    layoutLeftCol: {
      flexGrow: 0.5,
      [theme.breakpoints.down("md")]: {
        display: "none"
      }
    },
    layoutCenterCol: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      flexGrow: 1,
      overflowWrap: "anywhere",
      [theme.breakpoints.up("md")]: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: theme.custom.layout.centerColBasis,
        paddingLeft: theme.custom.layout.centerColPadding,
        paddingRight: theme.custom.layout.centerColPadding
      },
      "& img": {
        maxWidth: "100%"
      }
    },
    layoutRightCol: {
      flexGrow: 1,
      flexBasis: theme.custom.layout.rightColBasis,
      [theme.breakpoints.down("md")]: {
        display: "none"
      }
    },
    rightCol: {
      position: "sticky",
      top: theme.spacing(14), // TODO: calculate it based on AdrBrowserLayout's topSpace var
      alignSelf: "flex-start",
      paddingLeft: theme.spacing(2),
      minWidth: "20ch"
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

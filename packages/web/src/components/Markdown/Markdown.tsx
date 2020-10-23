import React from "react";
import moment from "moment";
import { compiler as mdCompiler } from "markdown-to-jsx";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Typography,
  Link as MuiLink,
  Button,
  Divider
} from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from "@material-ui/icons";
import Link from "@material-ui/core/Link";
import clsx from "clsx";
import { CustomTheme } from "../../mui";
import { Heading, Toc } from "./components";
import { slugify } from "../../lib/slugify";

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
    tocContainer: {
      position: "sticky",
      top: theme.spacing(14), // TODO: calculate it based on AdrBrowserLayout's topSpace var
      alignSelf: "flex-start",
      paddingLeft: theme.spacing(6)
    },
    tocTitle: {
      fontWeight: theme.typography.fontWeightBold,
      paddingBottom: theme.spacing(1)
    },
    toc: {
      marginTop: theme.spacing(2)
    },
    bottomNavDivider: {
      marginTop: theme.spacing(12)
    },
    bottomNav: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(6)
    },
    bottomInfo: {},
    bottomInfoText: {
      fontSize: "0.77rem",
      textAlign: "center",
      color: theme.palette.grey[600]
    },
    // Markdown:
    listItem: {
      marginTop: theme.spacing(1)
    }
  })
);

function Li(props: any) {
  const classes = useStyles();
  return (
    <li className={classes.listItem}>
      <Typography component="span" {...props} />
    </li>
  );
}

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: { variant: "h3", component: "h1", gutterBottom: true }
    },
    h2: {
      component: Heading,
      props: { variant: "h2" }
    },
    h3: {
      component: Heading,
      props: { variant: "h3" }
    },
    h4: {
      component: Heading,
      props: { variant: "h4" }
    },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: Link },
    li: { component: Li }
  },
  slugify
};

type MarkdownProps = {
  className?: string;
  children: string;
  lastEditDate: Date;
  lastEditAuthor?: string;
};

export function Markdown({
  className,
  children,
  lastEditDate,
  lastEditAuthor
}: MarkdownProps) {
  const classes = useStyles();

  if (!children) {
    return null;
  }

  const renderedMarkdown = mdCompiler(children, options);

  return (
    <div className={clsx(className, classes.root)}>
      <div className={classes.layoutLeftCol} />
      <div className={classes.layoutCenterCol}>
        {renderedMarkdown}
        <Divider className={classes.bottomNavDivider} />
        <nav className={classes.bottomNav}>
          <Button startIcon={<ArrowBackIcon />}>Previous</Button>
          <div className={classes.bottomInfo}>
            <Typography className={classes.bottomInfoText}>
              Last edit {lastEditAuthor ? `by ${lastEditAuthor}` : null}
            </Typography>
            <Typography className={classes.bottomInfoText}>
              on {moment(lastEditDate).format("DD/MM/YYYY HH:mm")}
            </Typography>
          </div>
          <Button endIcon={<ArrowForwardIcon />}>Next</Button>
        </nav>
      </div>
      <div className={clsx(classes.layoutRightCol, classes.tocContainer)}>
        <Typography variant="subtitle2" className={classes.tocTitle}>
          Table of contents
        </Typography>
        <Toc
          className={classes.toc}
          content={renderedMarkdown.props.children}
          levelStart={2}
        />
      </div>
    </div>
  );
}

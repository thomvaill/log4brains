import React from "react";
import ReactMarkdown from "markdown-to-jsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Typography, Link as MuiLink } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingRight: theme.spacing(3)
      }
    },
    leftGutter: {
      flexGrow: 1
    },
    mdContainer: {
      flexBasis: 750
    },
    tocContainer: {
      flexGrow: 1,
      position: "sticky",
      top: theme.spacing(14), // TODO: calculate it based on AdrBrowserLayout's topSpace var
      alignSelf: "flex-start",
      paddingLeft: theme.spacing(6)
    },
    tocUl: {
      listStyleType: "none",
      paddingLeft: "1rem"
    },
    tocRootUl: { padding: 0 },
    tocTitle: {
      fontWeight: theme.typography.fontWeightBold,
      paddingBottom: theme.spacing(1)
    },
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
      props: {
        gutterBottom: true,
        variant: "h3"
      }
    },
    h2: { component: Typography, props: { gutterBottom: true, variant: "h4" } },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: "h5" }
    },
    h4: {
      component: Typography,
      props: { gutterBottom: true, variant: "h6" }
    },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: Link },
    li: { component: Li }
  }
};

type MarkdownProps = {
  className?: string;
  children: string;
};

export function Markdown({ className, children }: MarkdownProps) {
  const classes = useStyles();

  if (!children) {
    return null;
  }

  return (
    <div className={clsx(className, classes.root)}>
      <div className={classes.leftGutter} />
      <div className={classes.mdContainer}>
        <ReactMarkdown options={options}>{children}</ReactMarkdown>
      </div>
      <div className={classes.tocContainer}>
        <Typography variant="subtitle2" className={classes.tocTitle}>
          Table of contents
        </Typography>
        <ul className={clsx(classes.tocUl, classes.tocRootUl)}>
          <li>
            <MuiLink href="#">Lorem Ipsum</MuiLink>
            <ul className={classes.tocUl}>
              <li>
                <MuiLink href="#">Lorem Ipsum</MuiLink>
              </li>
            </ul>
          </li>

          <li>
            <MuiLink href="#">Lorem Ipsum</MuiLink>
          </li>
          <li>
            <MuiLink href="#">Lorem Ipsum</MuiLink>
          </li>
          <li>
            <MuiLink href="#">Lorem Ipsum</MuiLink>
          </li>
          <li>
            <MuiLink href="#">Lorem Ipsum</MuiLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

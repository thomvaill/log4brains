import React from "react";
import ReactMarkdown from "markdown-to-jsx";
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
    tocUl: {
      listStyleType: "none",
      paddingLeft: "1rem"
    },
    tocRootUl: { padding: 0 },
    tocTitle: {
      fontWeight: theme.typography.fontWeightBold,
      paddingBottom: theme.spacing(1)
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
      <div className={classes.layoutLeftCol} />
      <div className={classes.layoutCenterCol}>
        <ReactMarkdown options={options}>{children}</ReactMarkdown>
        <Divider className={classes.bottomNavDivider} />
        <nav className={classes.bottomNav}>
          <Button startIcon={<ArrowBackIcon />}>Previous</Button>
          <div className={classes.bottomInfo}>
            <Typography className={classes.bottomInfoText}>
              Last edited by <MuiLink href="#">John Doe</MuiLink>
            </Typography>
            <Typography className={classes.bottomInfoText}>
              on 22/10/2020 12:04
            </Typography>
          </div>
          <Button endIcon={<ArrowForwardIcon />}>Next</Button>
        </nav>
      </div>
      <div className={clsx(classes.layoutRightCol, classes.tocContainer)}>
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

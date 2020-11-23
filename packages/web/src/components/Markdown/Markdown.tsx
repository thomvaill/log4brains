import React, { useEffect, useMemo } from "react";
import { compiler as mdCompiler } from "markdown-to-jsx";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Typography,
  Link as MuiLink,
  TypographyProps
} from "@material-ui/core";
import { CustomTheme } from "../../mui";
import { AdrLink } from "./components";
import { MarkdownHeading } from "../MarkdownHeading";
import { slugify } from "../../lib/slugify";

const useStyles = makeStyles((theme: CustomTheme) =>
  createStyles({
    listItem: {
      marginTop: theme.spacing(1)
    }
  })
);

function Li(props: TypographyProps) {
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
      component: MarkdownHeading,
      props: { variant: "h2" }
    },
    h3: {
      component: MarkdownHeading,
      props: { variant: "h3" }
    },
    h4: {
      component: MarkdownHeading,
      props: { variant: "h4" }
    },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: MuiLink },
    li: { component: Li },
    AdrLink: { component: AdrLink }
  },
  slugify
};

type MarkdownProps = {
  className?: string;
  children: string;
  onCompiled?: (content: React.ReactElement) => void;
};

function isReactElementWithChildren(
  obj: JSX.Element
): obj is React.ReactElement<{ children: React.ReactElement }> {
  return "children" in obj.props; // TODO: improve tests here
}

export function Markdown({ className, children, onCompiled }: MarkdownProps) {
  const renderedMarkdown = useMemo(() => mdCompiler(children, options), [
    children
  ]);
  useEffect(() => {
    if (onCompiled && isReactElementWithChildren(renderedMarkdown)) {
      onCompiled(renderedMarkdown.props.children);
    }
  }, [children, renderedMarkdown, onCompiled]);

  return <div className={className}>{renderedMarkdown}</div>;
}

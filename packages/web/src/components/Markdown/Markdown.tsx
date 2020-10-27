import React, { useEffect, useMemo } from "react";
import { compiler as mdCompiler } from "markdown-to-jsx";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography, Link as MuiLink } from "@material-ui/core";
import { CustomTheme } from "../../mui";
import { MarkdownHeading } from "./components";
import { slugify } from "../../lib/slugify";

const useStyles = makeStyles((theme: CustomTheme) =>
  createStyles({
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
    li: { component: Li }
  },
  slugify
};

type MarkdownProps = {
  className?: string;
  children: string;
  onCompiled?: (content: JSX.Element[] | JSX.Element) => void;
};

export function Markdown({ className, children, onCompiled }: MarkdownProps) {
  const renderedMarkdown = useMemo(() => mdCompiler(children, options), [
    children
  ]);
  useEffect(() => {
    if (onCompiled) {
      onCompiled(renderedMarkdown.props.children);
    }
  }, [children, renderedMarkdown.props.children, onCompiled]);

  return <div className={className}>{renderedMarkdown}</div>;
}

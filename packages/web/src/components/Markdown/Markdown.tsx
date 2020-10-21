import React from "react";
import ReactMarkdown from "markdown-to-jsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme: Theme) =>
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

export function Markdown(props: any) {
  if (!props.children) {
    return null;
  }
  return <ReactMarkdown options={options} {...props} />;
}

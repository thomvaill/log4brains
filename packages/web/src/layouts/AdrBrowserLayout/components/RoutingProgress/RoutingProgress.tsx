import { LinearProgress } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      top: 0,
      width: "100%",
      height: 2,
      position: "absolute"
    }
  })
);

export function RoutingProgress() {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress > 99.999) {
          clearInterval(timer);
          return 100;
        }
        return oldProgress + (100 - oldProgress) / 8;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <LinearProgress
      color="secondary"
      variant={progress < 100 ? "determinate" : "indeterminate"}
      value={progress}
      className={classes.root}
    />
  );
}

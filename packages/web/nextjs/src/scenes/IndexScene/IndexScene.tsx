import React from "react";
import Head from "next/head";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { Typography } from "@material-ui/core";
import { Log4brainsMode, Log4brainsModeContext } from "../../contexts";
import { Markdown, TwoColContent } from "../../components";
// eslint-disable-next-line import/no-cycle
import { ConnectedAdrBrowserLayout } from "../../layouts";

export type IndexSceneProps = {
  projectName: string;
  markdown: string;
  l4bVersion: string;
};

const useStyles = makeStyles(() =>
  createStyles({
    previewAlert: {
      width: "38ch"
    },
    previewAlertMessage: {
      paddingTop: 2
    }
  })
);

export function IndexScene({ projectName, markdown }: IndexSceneProps) {
  const classes = useStyles();

  const mode = React.useContext(Log4brainsModeContext);

  const previewAlert =
    mode === Log4brainsMode.preview ? (
      <Alert
        severity="warning"
        className={classes.previewAlert}
        classes={{ message: classes.previewAlertMessage }}
      >
        <Typography variant="h6">Preview mode</Typography>
        <Typography variant="body2">
          Hot Reload is enabled on all pages
        </Typography>
      </Alert>
    ) : null;

  return (
    <>
      <Head>
        <title>Architecture knowledge base of {projectName}</title>
        <meta
          name="description"
          content={`This architecture knowledge base contains all the Architecture Decision Records (ADR) of the ${projectName} project`}
        />
      </Head>
      <TwoColContent rightColContent={previewAlert}>
        <Markdown>{markdown}</Markdown>
      </TwoColContent>
    </>
  );
}

IndexScene.getLayout = (scene: JSX.Element, sceneProps: IndexSceneProps) => (
  <ConnectedAdrBrowserLayout {...sceneProps}>{scene}</ConnectedAdrBrowserLayout>
);

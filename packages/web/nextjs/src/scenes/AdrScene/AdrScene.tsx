import React from "react";
import moment from "moment";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Divider,
  Tooltip,
  Link as MuiLink,
  Hidden
} from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from "@material-ui/icons";
import Head from "next/head";
import Link from "next/link";
import { Alert } from "@material-ui/lab";
import { CustomTheme } from "../../mui";
import { Markdown, MarkdownToc, TwoColContent } from "../../components";
// eslint-disable-next-line import/no-cycle
import { ConnectedAdrBrowserLayout } from "../../layouts";
import { AdrHeader } from "./components";
import {
  AdrNavContext,
  Log4brainsMode,
  Log4brainsModeContext
} from "../../contexts";
import { Adr } from "../../lib-shared/types";
import { buildAdrUrl } from "../../lib/adr-utils";

const useStyles = makeStyles((theme: CustomTheme) =>
  createStyles({
    header: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(4)
    },
    alert: {
      marginBottom: theme.spacing(3)
    },
    bottomNavDivider: {
      marginTop: theme.spacing(12)
    },
    bottomNav: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: theme.spacing(1)
    },
    bottomInfo: {},
    bottomInfoText: {
      fontSize: "0.77rem",
      textAlign: "center",
      color: theme.palette.grey[600]
    }
  })
);

export type AdrSceneProps = {
  projectName: string;
  currentAdr: Adr;
  l4bVersion: string;
};

export function AdrScene({ projectName, currentAdr }: AdrSceneProps) {
  const classes = useStyles();

  const mode = React.useContext(Log4brainsModeContext);
  const adrNav = React.useContext(AdrNavContext);

  const [mdContent, setMdContent] = React.useState<
    React.ReactElement | undefined
  >(undefined);

  if (!currentAdr) {
    return null; // Happens during Next.js initial build
  }

  let alert;
  if (currentAdr.status === "superseded") {
    alert = (
      <Alert severity="warning" className={classes.alert}>
        This ADR is <strong>superseded</strong>
        {currentAdr.supersededBy ? (
          <>
            {" by "}
            <Link href={buildAdrUrl(currentAdr.supersededBy)} passHref>
              <MuiLink>{currentAdr.supersededBy.title || "Untitled"}</MuiLink>
            </Link>
          </>
        ) : null}
        .
      </Alert>
    );
  } else if (currentAdr.status === "deprecated") {
    alert = (
      <Alert severity="warning" className={classes.alert}>
        This ADR is <strong>deprecated</strong>.
      </Alert>
    );
  } else if (currentAdr.status === "rejected") {
    alert = (
      <Alert severity="error" className={classes.alert}>
        This ADR was <strong>rejected</strong>.
      </Alert>
    );
  }

  return (
    <>
      <Head>
        <title>
          {currentAdr.title || "Untitled"} ADR - Architecture knowledge base of{" "}
          {projectName}
        </title>
      </Head>
      <TwoColContent
        rightColContent={<MarkdownToc content={mdContent} levelStart={2} />}
      >
        <Typography variant="h3" gutterBottom>
          {currentAdr.title || "Untitled"}
        </Typography>
        <Divider />
        <AdrHeader
          adr={currentAdr}
          className={classes.header}
          locallyEditable={mode === Log4brainsMode.preview}
        />

        {alert}

        <Markdown onCompiled={setMdContent}>
          {currentAdr.body.enhancedMdx}
        </Markdown>

        <Divider className={classes.bottomNavDivider} />

        <nav className={classes.bottomNav}>
          {adrNav.previousAdr ? (
            <Link href={buildAdrUrl(adrNav.previousAdr)} passHref>
              <Tooltip
                title={adrNav.previousAdr.title || ""}
                aria-label="previous"
              >
                <Button startIcon={<ArrowBackIcon />}>
                  <Hidden xsDown implementation="css">
                    Previous
                  </Hidden>
                </Button>
              </Tooltip>
            </Link>
          ) : (
            <div />
          )}

          <div className={classes.bottomInfo}>
            <Typography className={classes.bottomInfoText}>
              Last edited by {currentAdr.lastEditAuthor}
            </Typography>
            <Typography className={classes.bottomInfoText}>
              on {moment(currentAdr.lastEditDate).format("lll")}
            </Typography>
          </div>
          {adrNav.nextAdr ? (
            <Link href={buildAdrUrl(adrNav.nextAdr)} passHref>
              <Tooltip title={adrNav.nextAdr.title || ""} aria-label="next">
                <Button endIcon={<ArrowForwardIcon />}>
                  <Hidden xsDown implementation="css">
                    Next
                  </Hidden>
                </Button>
              </Tooltip>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </TwoColContent>
    </>
  );
}

AdrScene.getLayout = (scene: JSX.Element, sceneProps: AdrSceneProps) => (
  <ConnectedAdrBrowserLayout {...sceneProps}>{scene}</ConnectedAdrBrowserLayout>
);

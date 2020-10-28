import React, { useCallback, useState } from "react";
import moment from "moment";
import { AdrDto } from "@log4brains/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Divider,
  Tooltip,
  Link as MuiLink
} from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from "@material-ui/icons";
import Link from "next/link";
import { Alert } from "@material-ui/lab";
import { CustomTheme } from "../../mui";
import { Markdown, MarkdownToc, TwoColContent } from "../../components";
import { AdrBrowserLayout } from "../../layouts";
import { AdrHeader } from "./components";

const useStyles = makeStyles((theme: CustomTheme) =>
  createStyles({
    header: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(4)
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
    }
  })
);

function buildAdrUrl(adr: AdrDto): string {
  return `/adr/${adr.slug}`;
}

function getAdrBySlug(slug: string, adrs: AdrDto[]): AdrDto | undefined {
  return adrs.filter((a) => a.slug === slug).pop();
}

function getPreviousAndNextAdrs(
  currentAdr: AdrDto,
  adrs: AdrDto[]
): [AdrDto | undefined, AdrDto | undefined] {
  const currentIndex = adrs
    .map((adr, index) => (adr.slug === currentAdr.slug ? index : undefined))
    .filter((adr) => adr !== undefined)
    .pop();
  const previousAdr =
    currentIndex !== undefined && currentIndex > 0
      ? adrs[currentIndex - 1]
      : undefined;
  const nextAdr =
    currentIndex !== undefined && currentIndex < adrs.length - 1
      ? adrs[currentIndex + 1]
      : undefined;
  return [previousAdr, nextAdr];
}

export type AdrSceneProps = {
  adrs: AdrDto[];
  currentAdr: AdrDto;
};

export function AdrScene({ adrs, currentAdr }: AdrSceneProps) {
  const classes = useStyles();

  const [mdContent, setMdContent] = useState<JSX.Element[] | JSX.Element>([]);

  if (!currentAdr) {
    return null; // Happens during Next.js initial build
  }

  let alert;
  if (currentAdr.status === "superseded") {
    const superseder = currentAdr.supersededBy
      ? getAdrBySlug(currentAdr.supersededBy, adrs)
      : undefined;
    alert = (
      <Alert severity="warning">
        This ADR is <strong>superseded</strong>
        {superseder ? (
          <>
            {" by "}
            <Link href={buildAdrUrl(superseder)} passHref>
              <MuiLink>{superseder.title || "Untitled"}</MuiLink>
            </Link>
          </>
        ) : null}
        .
      </Alert>
    );
  } else if (currentAdr.status === "deprecated") {
    alert = (
      <Alert severity="warning">
        This ADR is <strong>deprecated</strong>.
      </Alert>
    );
  } else if (currentAdr.status === "rejected") {
    alert = (
      <Alert severity="error">
        This ADR was <strong>rejected</strong>.
      </Alert>
    );
  }

  const [previousAdr, nextAdr] = getPreviousAndNextAdrs(currentAdr, adrs);

  return (
    <TwoColContent
      rightColTitle="Table of contents"
      rightColContent={<MarkdownToc content={mdContent} levelStart={2} />}
    >
      <Typography variant="h3" gutterBottom>
        {currentAdr.title || "Untitled"}
      </Typography>
      <Divider />
      <AdrHeader adr={currentAdr} className={classes.header} />

      {alert}

      <Markdown
        onCompiled={useCallback((content) => setMdContent(content), [])}
      >
        {currentAdr.body.enhancedMdx}
      </Markdown>

      <Divider className={classes.bottomNavDivider} />

      <nav className={classes.bottomNav}>
        {previousAdr ? (
          <Link href={buildAdrUrl(previousAdr)} passHref>
            <Tooltip title={previousAdr.title || ""} aria-label="previous">
              <Button startIcon={<ArrowBackIcon />}>Previous</Button>
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
        {nextAdr ? (
          <Link href={buildAdrUrl(nextAdr)} passHref>
            <Tooltip title={nextAdr.title || ""} aria-label="next">
              <Button endIcon={<ArrowForwardIcon />}>Next</Button>
            </Tooltip>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </TwoColContent>
  );
}

AdrScene.getLayout = (scene: JSX.Element, sceneProps: AdrSceneProps) => (
  <AdrBrowserLayout {...sceneProps}>{scene}</AdrBrowserLayout>
);

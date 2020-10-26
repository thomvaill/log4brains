import React, { useCallback, useState } from "react";
import moment from "moment";
import { AdrDto } from "@log4brains/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography, Button, Divider, Tooltip } from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from "@material-ui/icons";
import Link from "next/link";
import { CustomTheme } from "../../mui";
import { Markdown, MarkdownToc, TwoColContent } from "../../components";
import { AdrBrowserLayout } from "../../layouts";

const useStyles = makeStyles((theme: CustomTheme) =>
  createStyles({
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

export type AdrSceneProps = {
  adrs: AdrDto[];
  currentAdr: AdrDto;
};

export function AdrScene({ adrs, currentAdr }: AdrSceneProps) {
  const classes = useStyles();

  const [mdContent, setMdContent] = useState<JSX.Element[]>([]);

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

  return (
    <TwoColContent
      rightColTitle="Table of contents"
      rightColContent={<MarkdownToc content={mdContent} levelStart={2} />}
    >
      <Markdown
        onCompiled={useCallback((content) => setMdContent(content), [])}
      >
        {currentAdr.body.markdown}
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
            Last edit{" "}
            {currentAdr.lastEditAuthor
              ? `by ${currentAdr.lastEditAuthor}`
              : null}
          </Typography>
          <Typography className={classes.bottomInfoText}>
            on {moment(currentAdr.lastEditDate).format("DD/MM/YYYY HH:mm")}
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

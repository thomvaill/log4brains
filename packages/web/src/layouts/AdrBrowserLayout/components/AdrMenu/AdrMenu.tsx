import React from "react";
import moment from "moment";
import { Typography, Link as MuiLink } from "@material-ui/core";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator
} from "@material-ui/lab";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { EmojiFlags as EmojiFlagsIcon } from "@material-ui/icons";
import { AdrDto } from "@log4brains/core";
import Link from "next/link";
import clsx from "clsx";
import { AdrStatusChip } from "../../../../components";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    timeline: {
      padding: 0
    },
    timelineItem: {},
    timelineOppositeContentRoot: {
      flex: "0 0 12ch"
    },
    date: {
      fontSize: "0.8rem",
      color: theme.palette.grey[500]
    },
    package: {
      fontSize: "0.8rem",
      color: theme.palette.grey[700]
    },
    timelineStartOppositeContentRoot: {
      flex: "0 0 calc(12ch - 12px)"
    },
    timelineContentContainer: {
      paddingBottom: theme.spacing(2)
    },
    currentAdr: {
      color: theme.palette.secondary.main,
      "&:hover": {
        color: theme.palette.secondary.main
      }
    },
    draftLink: {},
    proposedLink: {},
    acceptedLink: {},
    rejectedLink: {
      textDecoration: "line-through"
    },
    deprecatedLink: {
      textDecoration: "line-through"
    },
    supersededLink: {
      textDecoration: "line-through"
    }
  })
);

type Props = {
  adrs: AdrDto[];
  currentAdr?: AdrDto;
  className?: string;
};

export function AdrMenu({ adrs, currentAdr, className }: Props) {
  const classes = useStyles();

  if (adrs === undefined) {
    return null; // Specific case during Next.js pre-rendering
  }

  let lastDateString = "";

  return (
    <div className={clsx(className, classes.root)}>
      <Timeline className={classes.timeline}>
        {adrs.map((adr) => {
          const currentDateString = moment(
            adr.publicationDate || adr.creationDate
          ).format("MMMM|YYYY");
          const dateString =
            currentDateString === lastDateString ? "" : currentDateString;
          lastDateString = currentDateString;
          const [month, year] = dateString.split("|");

          return (
            <TimelineItem key={adr.slug} className={classes.timelineItem}>
              <TimelineOppositeContent
                classes={{ root: classes.timelineOppositeContentRoot }}
              >
                <Typography variant="body2" className={classes.date}>
                  {month}
                </Typography>
                <Typography variant="body2" className={classes.date}>
                  {year}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div className={classes.timelineContentContainer}>
                  <Link href={`/adr/${adr.slug}`} passHref>
                    <MuiLink
                      className={clsx({
                        [classes.currentAdr]: currentAdr?.slug === adr.slug,
                        [classes[`${adr.status}Link`]]: true
                      })}
                      variant="body2"
                    >
                      {adr.title || "Untitled"}
                    </MuiLink>
                  </Link>
                  {["draft", "proposed"].includes(adr.status) ? (
                    <AdrStatusChip status={adr.status} />
                  ) : (
                    ""
                  )}
                  <Typography variant="body2" className={classes.package}>
                    {adr.package || "global"}
                  </Typography>
                </div>
              </TimelineContent>
            </TimelineItem>
          );
        })}

        <TimelineItem>
          <TimelineOppositeContent
            classes={{ root: classes.timelineStartOppositeContentRoot }}
          />
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              <EmojiFlagsIcon />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent />
        </TimelineItem>
      </Timeline>
    </div>
  );
}

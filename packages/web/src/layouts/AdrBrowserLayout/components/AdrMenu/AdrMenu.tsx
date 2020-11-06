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
import {
  EmojiFlags as EmojiFlagsIcon,
  CropFree as CropFreeIcon
} from "@material-ui/icons";
import Link from "next/link";
import clsx from "clsx";
import { AdrStatusChip } from "../../../../components";
import { AdrLight } from "../../../../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    timeline: {
      padding: 0
    },
    adrLink: {
      display: "block"
    },
    timelineItem: {
      "&:hover": {
        "& $timelineConnector": {
          backgroundColor: theme.palette.primary.main
        }
      }
    },
    selectedTimelineItem: {
      "&:hover": {
        "& $timelineConnector": {
          backgroundColor: theme.palette.secondary.main
        }
      },
      "& $timelineConnector": {
        backgroundColor: theme.palette.secondary.main
      },
      "& $adrLink": {
        color: theme.palette.secondary.main,
        "&:hover": {
          color: theme.palette.secondary.main
        }
      }
    },
    timelineOppositeContentRoot: {
      flex: "0 0 12ch"
    },
    date: {
      fontSize: "0.8rem",
      color: theme.palette.grey[500]
    },
    adrStatusChip: {
      marginLeft: "-1ch"
    },
    icon: {
      verticalAlign: "middle"
    },
    adrTitle: {
      marginRight: "0.5ch"
    },
    package: {
      fontSize: "0.8rem",
      verticalAlign: "text-top",
      whiteSpace: "pre",
      color: theme.palette.grey[700]
    },
    timelineStartOppositeContentRoot: {
      flex: "0 0 calc(12ch - 12px)"
    },
    timelineContentContainer: {
      paddingBottom: theme.spacing(2)
    },
    timelineConnector: {},
    currentAdrTimelineConnector: {
      backgroundColor: theme.palette.secondary.main
    },
    // TODO: refactor with AdrLink.tsx
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
  adrs: AdrLight[];
  currentAdrSlug?: string;
  className?: string;
};

export function AdrMenu({ adrs, currentAdrSlug, className }: Props) {
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
            <TimelineItem
              key={adr.slug}
              className={clsx(classes.timelineItem, {
                [classes.selectedTimelineItem]: currentAdrSlug === adr.slug
              })}
            >
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
                <TimelineDot className={classes.timelineConnector} />
                <TimelineConnector className={classes.timelineConnector} />
              </TimelineSeparator>
              <TimelineContent>
                <div className={classes.timelineContentContainer}>
                  <Link href={`/adr/${adr.slug}`} passHref>
                    <MuiLink
                      className={clsx(classes.adrLink, {
                        [classes[
                          `${adr.status}Link` as keyof typeof classes
                        ]]: true
                      })}
                      variant="body2"
                    >
                      <span className={classes.adrTitle}>
                        {adr.title || "Untitled"}
                      </span>
                      {adr.package ? (
                        <span className={classes.package}>
                          <CropFreeIcon
                            fontSize="inherit"
                            className={classes.icon}
                          />{" "}
                          {adr.package}
                        </span>
                      ) : null}
                    </MuiLink>
                  </Link>
                  <div>
                    <AdrStatusChip
                      status={adr.status}
                      className={classes.adrStatusChip}
                    />
                  </div>
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

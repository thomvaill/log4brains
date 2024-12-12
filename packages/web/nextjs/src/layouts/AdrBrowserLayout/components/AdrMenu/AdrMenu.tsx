import React from "react";
import moment from "moment";
import {
  Typography,
  Link as MuiLink,
  Fab,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from "@material-ui/core";
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
  CropFree as CropFreeIcon,
  Add as AddIcon
} from "@material-ui/icons";
import Link from "next/link";
import clsx from "clsx";
import { Log4brainsMode, Log4brainsModeContext } from "../../../../contexts";
import { AdrStatusChip } from "../../../../components";
import { AdrLight } from "../../../../lib-shared/types";

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
    timelineOppositeContentRootAdd: {
      flex: "0 0 calc(12ch - 11.5px)"
    },
    timelineOppositeContentRoot: {
      flex: "0 0 12ch"
    },
    newAdrFab: {
      width: 35,
      height: 35
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
  adrs?: AdrLight[];
  currentAdrSlug?: string;
  className?: string;
};

export function AdrMenu({ adrs, currentAdrSlug, className, ...props }: Props) {
  const classes = useStyles();

  const [newAdrOpen, setNewAdrOpen] = React.useState(false);
  const mode = React.useContext(Log4brainsModeContext);

  if (adrs === undefined) {
    return null; // Because inside a <Grow>
  }

  let lastDateString = "";

  return (
    <div className={clsx(className, classes.root)} {...props}>
      {mode === Log4brainsMode.preview && (
        <Dialog
          open={newAdrOpen}
          onClose={() => setNewAdrOpen(false)}
          aria-labelledby="newadr-dialog-title"
          aria-describedby="newadr-dialog-description"
        >
          <DialogTitle id="newadr-dialog-title">Create a new ADR</DialogTitle>
          <DialogContent>
            <DialogContentText id="newadr-dialog-description">
              <Typography>
                Run the following command in your terminal:
              </Typography>
              <pre>
                <code className="hljs bash">log4brains adr new</code>
              </pre>
              <Typography>
                This will create a new ADR from your template and will open it
                in your editor.
                <br />
                Just press <code>Ctrl+S</code> to watch your changes here,
                thanks to Hot Reload.
              </Typography>
              <Typography variant="body2" style={{ marginTop: 20 }}>
                Would you have preferred to create a new ADR directly from here?
                <br />
                Leave a 👍 on{" "}
                <MuiLink
                  href="https://github.com/thomvaill/log4brains/issues/9"
                  target="_blank"
                  rel="noopener"
                >
                  this GitHub issue
                </MuiLink>{" "}
                then!
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setNewAdrOpen(false)}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Timeline className={classes.timeline}>
        {mode === Log4brainsMode.preview && (
          <TimelineItem className={classes.timelineItem}>
            <TimelineOppositeContent
              classes={{ root: classes.timelineOppositeContentRootAdd }}
            />
            <TimelineSeparator>
              <Tooltip title="Create a new ADR">
                <Fab
                  size="small"
                  color="primary"
                  aria-label="create a new ADR"
                  className={classes.newAdrFab}
                  onClick={() => setNewAdrOpen(true)}
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent />
          </TimelineItem>
        )}

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

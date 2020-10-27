import React from "react";
import moment from "moment";
import { Button, ButtonGroup, Tooltip, Typography } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import {
  CropFree as CropFreeIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Label as LabelIcon,
  Share as ShareIcon,
  GitHub as GitHubIcon,
  Edit as EditIcon
} from "@material-ui/icons";
import clsx from "clsx";
import { AdrDto } from "@log4brains/core";
import { AdrStatusChip } from "../../../../components";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.grey[700],
      display: "flex",
      justifyContent: "space-between"
    },
    inlineInfo: {
      display: "flex",

      "& > *": {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
      },
      "& > *:first-child": {
        marginLeft: 0
      },
      "& > *:last-child": {
        marginRight: 0
      }
    },
    icon: {
      verticalAlign: "middle"
    },
    tags: {
      color: theme.palette.grey[600]
    }
  })
);

export type AdrHeaderProps = {
  className?: string;
  adr: AdrDto;
};

export function AdrHeader({ className, adr }: AdrHeaderProps) {
  const classes = useStyles();

  const decidersIcon =
    adr.deciders.length > 1 ? (
      <PeopleIcon className={classes.icon} fontSize="inherit" />
    ) : (
      <PersonIcon className={classes.icon} fontSize="inherit" />
    );

  return (
    <div className={clsx(className, classes.root)}>
      <div>
        <div className={classes.inlineInfo}>
          {adr.package ? (
            <Typography variant="body2" title="Package">
              <CropFreeIcon className={classes.icon} fontSize="inherit" />{" "}
              {adr.package}
            </Typography>
          ) : null}

          <Typography
            variant="body2"
            title={adr.publicationDate ? "Publication date" : "Creation date"}
          >
            <EventIcon className={classes.icon} fontSize="inherit" />{" "}
            {moment(adr.publicationDate || adr.creationDate).format("ll")}
          </Typography>

          <div title="Status">
            <AdrStatusChip status={adr.status} />
          </div>
        </div>

        <Typography
          variant="body2"
          title={
            adr.deciders.length > 0
              ? `Decider${adr.deciders.length > 1 ? "s" : ""}`
              : "Author"
          }
        >
          {decidersIcon}{" "}
          {adr.deciders.length > 1
            ? adr.deciders.join(", ")
            : adr.lastEditAuthor}
        </Typography>

        {adr.tags.length > 0 ? (
          <Typography variant="body2" title="Tags">
            <LabelIcon className={classes.icon} fontSize="inherit" />{" "}
            <span className={classes.tags}>
              {adr.tags.map((tag) => `#${tag}`).join(" ")}
            </span>
          </Typography>
        ) : null}
      </div>
      <div>
        <div>
          <ButtonGroup size="medium">
            <Tooltip title="Share">
              <Button>
                <ShareIcon fontSize="small" />
              </Button>
            </Tooltip>

            <Tooltip title="Edit on Github">
              <Button>
                <GitHubIcon fontSize="small" />
              </Button>
            </Tooltip>

            <Tooltip title="Edit locally">
              <Button color="secondary">
                <EditIcon fontSize="small" />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

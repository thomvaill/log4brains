import React from "react";
import moment from "moment";
import copyTextToClipboard from "copy-text-to-clipboard";
import {
  Button,
  ButtonGroup,
  Snackbar,
  Tooltip,
  Typography,
  IconButton,
  SvgIcon
} from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import {
  CropFree as CropFreeIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Label as LabelIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from "@material-ui/icons";
import {
  AiFillGithub as GithubRIcon,
  AiFillGitlab as GitlabRIcon
} from "react-icons/ai";
import {
  DiBitbucket as BitbucketRIcon,
  DiGit as GitRIcon
} from "react-icons/di";
import { FiLink as LinkRIcon } from "react-icons/fi";
import clsx from "clsx";
import { AdrStatusChip } from "../../../../components";
import { Adr } from "../../../../lib-shared/types";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getRepositoryIcon(provider: string): JSX.Element {
  switch (provider) {
    case "github":
      return (
        <SvgIcon>
          <GithubRIcon />
        </SvgIcon>
      );
      break;

    case "gitlab":
      return (
        <SvgIcon>
          <GitlabRIcon />
        </SvgIcon>
      );
      break;

    case "bitbucket":
      return (
        <SvgIcon>
          <BitbucketRIcon />
        </SvgIcon>
      );
      break;

    default:
      return (
        <SvgIcon>
          <GitRIcon />
        </SvgIcon>
      );
      break;
  }
}

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

async function editLocally(slug: string): Promise<void> {
  await fetch(`/api/adr/${slug}/_open-in-editor`, { method: "post" });
}

export type AdrHeaderProps = {
  className?: string;
  adr: Adr;
  locallyEditable?: boolean;
};

export function AdrHeader({
  className,
  adr,
  locallyEditable = false
}: AdrHeaderProps) {
  const classes = useStyles();

  const [linkCopiedSnackIsOpened, linkCopiedSnackSetOpened] = React.useState(
    false
  );
  const linkCopiedSnackClose = () => {
    linkCopiedSnackSetOpened(false);
  };

  const decidersIcon =
    adr.deciders.length > 1 ? (
      <PeopleIcon className={classes.icon} fontSize="inherit" />
    ) : (
      <PersonIcon className={classes.icon} fontSize="inherit" />
    );

  return (
    <>
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
            {adr.deciders.length > 0
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
              <Tooltip title="Copy link">
                <Button
                  onClick={() => {
                    copyTextToClipboard(
                      window.location.href.replace(window.location.hash, "")
                    );
                    linkCopiedSnackSetOpened(true);
                  }}
                >
                  <SvgIcon>
                    <LinkRIcon />
                  </SvgIcon>
                </Button>
              </Tooltip>

              {adr.repository ? (
                <Tooltip
                  title={`View/edit on ${
                    adr.repository.provider === "generic"
                      ? "Git"
                      : capitalize(adr.repository.provider)
                  }`}
                >
                  <Button
                    href={adr.repository.viewUrl}
                    target="_blank"
                    rel="noopener"
                  >
                    {getRepositoryIcon(adr.repository.provider)}
                  </Button>
                </Tooltip>
              ) : null}

              {locallyEditable ? (
                <Tooltip title="Edit locally">
                  <Button
                    color="secondary"
                    onClick={() => editLocally(adr.slug)}
                  >
                    <EditIcon />
                  </Button>
                </Tooltip>
              ) : null}
            </ButtonGroup>
          </div>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={linkCopiedSnackIsOpened}
        onClose={linkCopiedSnackClose}
        autoHideDuration={6000}
        message="Link copied to clipboard"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={linkCopiedSnackClose}
            title="Close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

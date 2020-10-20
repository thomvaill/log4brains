import React from "react";
import {
  AppBar,
  Badge,
  Divider,
  Drawer,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Link as MuiLink
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
import {
  createStyles,
  Theme,
  makeStyles,
  fade
} from "@material-ui/core/styles";
import {
  Search as SearchIcon,
  ChevronRight as ChevronRightIcon,
  FormatListBulleted as FormatListBulletedIcon,
  EmojiFlags as EmojiFlagsIcon
} from "@material-ui/icons";
import { AdrDto } from "@log4brains/core";
import Link from "next/link";
import clsx from "clsx";
import { Markdown } from "../../components";

const drawerWidth = 450;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    title: {
      flexGrow: 1,
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto"
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "30ch",
        "&:focus": {
          width: "50ch"
        }
      }
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    drawerContainer: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      paddingTop: theme.spacing(3)
    },
    timelineContainer: {
      overflow: "auto",
      flexGrow: 1
    },
    timeline: {},
    timelineOppositeContentRoot: {
      flex: "0 0 32%"
    },
    timelineStartOppositeContentRoot: {
      flex: "0 0 calc(32% - 12px)" // TODO: better calc
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    currentAdr: {
      color: "red"
    }
  })
);

type Props = {
  adrs: AdrDto[];
  currentAdr?: AdrDto;
  children: JSX.Element;
};

export function AdrBrowserLayout({ adrs, currentAdr, children }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <div className={classes.title}>
            <Typography variant="h6" noWrap>
              Log4brains
            </Typography>
            <Typography variant="body1" noWrap>
              Architecture decisions log
            </Typography>
          </div>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <div className={classes.timelineContainer}>
            <Timeline className={classes.timeline}>
              {adrs.map((adr) => (
                <TimelineItem key={adr.slug}>
                  <TimelineOppositeContent
                    classes={{ root: classes.timelineOppositeContentRoot }}
                  >
                    <Typography>{adr.status.toUpperCase()}</Typography>
                    <Typography variant="body2">{adr.package}</Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Link href={`/adr/${adr.slug}`}>
                      <MuiLink
                        href={`/adr/${adr.slug}`}
                        className={clsx({
                          [classes.currentAdr]:
                            currentAdr?.slug === adr.slug
                        })}
                      >
                        {adr.title || "Untitled"}
                      </MuiLink>
                    </Link>
                  </TimelineContent>
                </TimelineItem>
              ))}

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
          <List>
            <ListItem button>
              <ListItemIcon>
                <ChevronRightIcon />
              </ListItemIcon>
              <ListItemText>
                <Badge badgeContent={0} color="primary">
                  <Typography>Filters</Typography>
                </Badge>
              </ListItemText>
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemIcon>
                <FormatListBulletedIcon />
              </ListItemIcon>
              <ListItemText primary="Decision backlog" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  );
}

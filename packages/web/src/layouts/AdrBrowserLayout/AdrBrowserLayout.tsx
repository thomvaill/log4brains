import React from "react";
import {
  AppBar,
  // Divider,
  Drawer,
  List,
  // ListItem,
  // ListItemIcon,
  // ListItemText,
  Toolbar,
  Link as MuiLink,
  Typography,
  Backdrop,
  NoSsr,
  CircularProgress,
  Grow,
  Fade
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
// import {
//   ChevronRight as ChevronRightIcon,
//   PlaylistAddCheck as PlaylistAddCheckIcon
// } from "@material-ui/icons";
import Link from "next/link";
import clsx from "clsx";
import { AdrMenu } from "./components/AdrMenu";
import { CustomTheme } from "../../mui";
import { ConnectedSearchBox } from "./components/ConnectedSearchBox/ConnectedSearchBox";
import { AdrLight } from "../../types";
import { AdrNav, AdrNavContext } from "../../contexts";
import { RoutingProgress } from "./components/RoutingProgress";

const drawerWidth = 450;
const searchTransitionDuration = 300;

const useStyles = makeStyles((theme: CustomTheme) => {
  const topSpace = theme.spacing(6);
  return createStyles({
    root: {
      display: "flex"
    },
    layoutLeftCol: {
      flexGrow: 1
    },
    layoutCenterCol: {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: theme.custom.layout.centerColBasis
    },
    layoutRightCol: {
      flexGrow: 1,
      flexBasis: theme.custom.layout.rightColBasis
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    appBarTitle: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "flex",
        alignItems: "center",
        width: drawerWidth,
        cursor: "pointer"
      }
    },
    appBarTitleLink: {
      display: "block",
      color: "inherit",
      "&:hover": {
        color: "inherit"
      },
      marginLeft: theme.spacing(2)
    },
    searchBackdrop: {
      zIndex: theme.zIndex.modal - 2
    },
    searchBox: {
      zIndex: theme.zIndex.modal - 1,
      width: "40%",
      transition: theme.transitions.create("width", {
        duration: searchTransitionDuration
      })
    },
    searchBoxOpen: {
      width: "100%"
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
      paddingTop: topSpace
    },
    adrMenu: {
      flexGrow: 1,
      flexShrink: 1,
      overflow: "auto",
      "&::-webkit-scrollbar": {
        width: 6,
        backgroundColor: theme.palette.background
      },
      "&::-webkit-scrollbar-thumb": {
        borderRadius: 10,
        "-webkit-box-shadow": "inset 0 0 2px rgba(0,0,0,.3)",
        backgroundColor: theme.palette.grey[400]
      }
    },
    bottomMenuList: {
      flexGrow: 0,
      flexShrink: 0
    },
    adlTitleAndSpinner: {
      display: "flex",
      justifyContent: "space-between",
      paddingLeft: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing(3)
      },
      paddingBottom: theme.spacing(0.5),
      paddingRight: theme.spacing(3)
    },
    adlTitle: {
      fontWeight: theme.typography.fontWeightBold
    },
    adrMenuSpinner: {
      alignSelf: "center",
      marginTop: "30vh"
    },
    container: {
      flexGrow: 1,
      paddingTop: topSpace
    },
    content: {
      minHeight: `calc(100vh - 35px - ${topSpace + theme.spacing(8)}px)` // TODO: calc AppBar height more precisely
    },
    footer: {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.grey[500],
      height: 35,
      display: "flex"
      // alignItems: "flex-start"
    },
    footerText: {
      // marginTop: theme.spacing(2),
      fontSize: "0.77rem"
    },
    footerLink: {
      color: theme.palette.grey[600],
      fontSize: "0.8rem",
      "&:hover": {
        color: theme.palette.grey[800]
      }
    },
    footerContent: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  });
});

function buildAdrNav(currentAdr: AdrLight, adrs: AdrLight[]): AdrNav {
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
  return {
    previousAdr,
    nextAdr
  };
}

export type AdrBrowserLayoutProps = {
  adrs?: AdrLight[]; // undefined -> loading, empty -> empty
  adrsReloading?: boolean;
  currentAdr?: AdrLight;
  children: React.ReactNode;
  routing?: boolean;
  l4bVersion: string;
};

export function AdrBrowserLayout({
  adrs,
  adrsReloading = false,
  currentAdr,
  children,
  routing = false,
  l4bVersion
}: AdrBrowserLayoutProps) {
  const classes = useStyles();

  const [searchOpen, setSearchOpenState] = React.useState(false);
  const [searchReallyOpen, setSearchReallyOpenState] = React.useState(false);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        {routing && <RoutingProgress />}
        <Toolbar>
          <Link href="/">
            <div className={classes.appBarTitle}>
              <div>
                <img
                  src="/Log4brains-logo-dark.png"
                  alt="Log4brains logo"
                  width={50}
                  height={50}
                />
              </div>
              <div>
                <Link href="/" passHref>
                  <MuiLink
                    variant="h6"
                    noWrap
                    className={classes.appBarTitleLink}
                  >
                    Log4brains
                  </MuiLink>
                </Link>
                <Link href="/" passHref>
                  <MuiLink
                    variant="body2"
                    noWrap
                    className={classes.appBarTitleLink}
                  >
                    Architecture knowledge base
                  </MuiLink>
                </Link>
              </div>
            </div>
          </Link>
          <div className={classes.layoutLeftCol} />
          <div className={clsx(classes.layoutCenterCol)}>
            <Backdrop open={searchOpen} className={classes.searchBackdrop} />
            <NoSsr>
              <ConnectedSearchBox
                onOpen={() => {
                  setSearchOpenState(true);
                  // Delayed real opening because otherwise the dropdown width is bugged
                  setTimeout(
                    () => setSearchReallyOpenState(true),
                    searchTransitionDuration + 100
                  );
                }}
                onClose={() => {
                  setSearchOpenState(false);
                  setSearchReallyOpenState(false);
                }}
                open={searchReallyOpen}
                className={clsx(classes.searchBox, {
                  [classes.searchBoxOpen]: searchOpen
                })}
              />
            </NoSsr>
          </div>
          <div className={classes.layoutRightCol} />
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerContainer}>
          <Toolbar />

          <div className={classes.adlTitleAndSpinner}>
            <Typography variant="subtitle2" className={classes.adlTitle}>
              Decisions log
            </Typography>

            <Fade in={adrsReloading}>
              <CircularProgress size={13} />
            </Fade>
          </div>

          <Grow
            in={adrs !== undefined}
            style={{ transformOrigin: "center left" }}
          >
            <AdrMenu
              adrs={adrs}
              currentAdrSlug={currentAdr?.slug}
              className={classes.adrMenu}
            />
          </Grow>

          {adrs === undefined && (
            <CircularProgress size={30} className={classes.adrMenuSpinner} />
          )}

          <List className={classes.bottomMenuList}>
            {/* <Divider />
            <ListItem button>
              <ListItemIcon>
                <ChevronRightIcon />
              </ListItemIcon>
              <ListItemText>
                <Badge badgeContent={0} color="primary">
                  <Typography>Filters</Typography>
                </Badge>
              </ListItemText>
            </ListItem> */}
            {/* <Divider />
            <Link href="/decision-backlog" passHref>
              <ListItem button selected={backlog} component="a">
                <ListItemIcon>
                  <PlaylistAddCheckIcon />
                </ListItemIcon>
                <ListItemText primary="Decision backlog" />
              </ListItem>
            </Link> */}
          </List>
        </div>
      </Drawer>
      <div className={classes.container}>
        <Toolbar />
        <main className={classes.content}>
          <AdrNavContext.Provider
            value={currentAdr && adrs ? buildAdrNav(currentAdr, adrs) : {}}
          >
            {children}
          </AdrNavContext.Provider>
        </main>
        <footer className={classes.footer}>
          <div className={classes.layoutLeftCol} />
          <div className={clsx(classes.layoutCenterCol, classes.footerContent)}>
            <Typography className={classes.footerText}>
              Powered by{" "}
              <MuiLink
                href="https://github.com/thomvaill/log4brains"
                className={classes.footerLink}
                target="_blank"
                rel="noopener"
              >
                Log4brains
              </MuiLink>{" "}
              <span style={{ fontSize: "0.8em" }}>(v{l4bVersion})</span>
            </Typography>
          </div>
          <div className={classes.layoutRightCol} />
        </footer>
      </div>
    </div>
  );
}

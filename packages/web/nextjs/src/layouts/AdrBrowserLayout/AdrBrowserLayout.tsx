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
  Fade,
  Hidden,
  IconButton
} from "@material-ui/core";
import { Menu as MenuIcon, Close as CloseIcon } from "@material-ui/icons";
import { createStyles, makeStyles } from "@material-ui/core/styles";
// import {
//   ChevronRight as ChevronRightIcon,
//   PlaylistAddCheck as PlaylistAddCheckIcon
// } from "@material-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { AdrMenu } from "./components/AdrMenu";
import { CustomTheme } from "../../mui";
import { ConnectedSearchBox } from "./components/ConnectedSearchBox/ConnectedSearchBox";
import { AdrLight } from "../../lib-shared/types";
import { AdrNav, AdrNavContext } from "../../contexts";
import { RoutingProgress } from "./components/RoutingProgress";

const drawerWidth = 380;
const searchTransitionDuration = 300;

const useStyles = makeStyles((theme: CustomTheme) => {
  const topSpace = theme.spacing(6);
  return createStyles({
    root: {
      display: "flex"
    },
    layoutLeftCol: {
      flexGrow: 0.5,
      [theme.breakpoints.down("md")]: {
        display: "none"
      }
    },
    layoutCenterCol: {
      paddingLeft: theme.custom.layout.centerColPadding,
      paddingRight: theme.custom.layout.centerColPadding,
      flexGrow: 1,
      [theme.breakpoints.up("md")]: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: theme.custom.layout.centerColBasis
      }
    },
    layoutRightCol: {
      flexGrow: 1,
      flexBasis: theme.custom.layout.rightColBasis,
      [theme.breakpoints.down("md")]: {
        display: "none"
      }
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    appBarMenuButton: {
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    appBarTitle: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "flex",
        alignItems: "center",
        width: drawerWidth - theme.spacing(3),
        flexGrow: 0,
        flexShrink: 0,
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
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "70%"
      },
      transition: theme.transitions.create("width", {
        duration: searchTransitionDuration
      })
    },
    searchBoxOpen: {
      width: "100%"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    drawerPaper: {
      width: drawerWidth
    },
    drawerContainer: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("sm")]: {
        paddingTop: topSpace
      }
    },
    drawerToolbar: {
      visibility: "visible",
      [theme.breakpoints.up("sm")]: {
        visibility: "hidden"
      },
      justifyContent: "space-between"
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
      paddingTop: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingTop: topSpace
      }
    },
    content: {
      minHeight: `calc(100vh - 35px - ${
        theme.spacing(1) + theme.spacing(8)
      }px)`, // TODO: calc AppBar height more precisely
      [theme.breakpoints.up("sm")]: {
        minHeight: `calc(100vh - 35px - ${topSpace + theme.spacing(8)}px)` // TODO: calc AppBar height more precisely
      }
    },
    footer: {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.grey[500],
      height: 35,
      display: "flex",
      marginTop: theme.spacing(6)
    },
    footerText: {
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
    currentIndex !== undefined && currentIndex < adrs.length - 1
      ? adrs[currentIndex + 1]
      : undefined;
  const nextAdr =
    currentIndex !== undefined && currentIndex > 0
      ? adrs[currentIndex - 1]
      : undefined;
  return {
    previousAdr,
    nextAdr
  };
}

export type AdrBrowserLayoutProps = {
  projectName: string;
  adrs?: AdrLight[]; // undefined -> loading, empty -> empty
  adrsReloading?: boolean;
  currentAdr?: AdrLight;
  children: React.ReactNode;
  routing?: boolean;
  l4bVersion: string;
};

export function AdrBrowserLayout({
  projectName,
  adrs,
  adrsReloading = false,
  currentAdr,
  children,
  routing = false,
  l4bVersion
}: AdrBrowserLayoutProps) {
  const classes = useStyles();
  const router = useRouter();

  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  React.useEffect(() => {
    const closeMobileDrawer = () => setMobileDrawerOpen(false);
    router?.events.on("routeChangeStart", closeMobileDrawer);
    return () => {
      router?.events.off("routeChangeStart", closeMobileDrawer);
    };
  }, [router]);

  const [searchOpen, setSearchOpenState] = React.useState(false);
  const [searchReallyOpen, setSearchReallyOpenState] = React.useState(false);

  const drawer = (
    <div className={classes.drawerContainer}>
      <Toolbar className={classes.drawerToolbar}>
        <div />
        <Link href="/" passHref>
          <IconButton
            size="small"
            color="inherit"
            aria-label="go to homepage"
            title={`Architecture knowledge base of ${projectName}`}
          >
            <img
              src={`${router?.basePath}/l4b-static/Log4brains-logo.png`}
              alt="Log4brains logo"
              width={40}
              height={40}
            />
          </IconButton>
        </Link>
        <IconButton
          size="small"
          color="inherit"
          aria-label="close drawer"
          title="Close"
          onClick={handleMobileDrawerToggle}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Toolbar>

      <div className={classes.adlTitleAndSpinner}>
        <Typography variant="subtitle2" className={classes.adlTitle}>
          Decision log
        </Typography>

        <Fade in={adrsReloading}>
          <CircularProgress size={13} />
        </Fade>
      </div>

      <Grow in={adrs !== undefined} style={{ transformOrigin: "center left" }}>
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
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        {routing && <RoutingProgress />}
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleMobileDrawerToggle}
            className={classes.appBarMenuButton}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/">
            <div className={classes.appBarTitle}>
              <div>
                <img
                  src={`${router?.basePath}/l4b-static/Log4brains-logo-dark.png`}
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
                    {projectName}
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

      <nav
        className={classes.drawer}
        aria-label="architecture decision records list"
      >
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileDrawerOpen}
            onClose={handleMobileDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

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
              <span style={{ fontSize: "0.8em" }}>
                {l4bVersion ? `(v${l4bVersion})` : null}
              </span>
            </Typography>
          </div>
          <div className={classes.layoutRightCol} />
        </footer>
      </div>
    </div>
  );
}

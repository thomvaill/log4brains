import React from "react";
import {
  AppBar,
  Divider,
  Drawer,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Link as MuiLink,
  Typography
} from "@material-ui/core";
import {
  createStyles,
  Theme,
  makeStyles,
  fade
} from "@material-ui/core/styles";
import {
  Search as SearchIcon,
  ChevronRight as ChevronRightIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon
} from "@material-ui/icons";
import Link from "next/link";
import clsx from "clsx";
import { AdrDto } from "@log4brains/core";
import { AdrMenu } from "./components/AdrMenu";
import { CustomTheme } from "../../mui";

const drawerWidth = 450;

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
        display: "block",
        width: drawerWidth
      }
    },
    appBarTitleLink: {
      display: "block",
      color: "inherit",
      "&:hover": {
        color: "inherit"
      }
    },
    appBarSearchContainer: {
      display: "flex"
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
        width: "40ch",
        "&:focus": {
          width: `calc(${
            theme.custom.layout.centerColBasis
          }px - 1em - ${theme.spacing(4)}px)`
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
      paddingTop: topSpace
    },
    adrMenu: {
      flexGrow: 1,
      flexShrink: 1,
      overflow: "auto"
    },
    bottomMenuList: {
      flexGrow: 0,
      flexShrink: 0
    },
    adlTitle: {
      fontWeight: theme.typography.fontWeightBold,
      paddingLeft: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing(3)
      },
      paddingBottom: theme.spacing(0.5)
    },
    container: {
      flexGrow: 1,
      paddingTop: topSpace
    },
    content: {
      minHeight: `calc(100vh - 57px - ${topSpace + theme.spacing(8)}px)` // TODO: calc AppBar height more precisely
    },
    footer: {
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.grey[600],
      height: 57,
      display: "flex"
    },
    footerText: {
      fontSize: "0.77rem"
    },
    footerLink: {
      color: theme.palette.grey[400],
      fontSize: "0.8rem",
      "&:hover": {
        color: theme.palette.grey[100]
      }
    },
    footerContent: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  });
});

export type AdrBrowserLayoutProps = {
  adrs: AdrDto[];
  currentAdr?: AdrDto;
  children: React.ReactNode;
  backlog?: boolean;
};

export function AdrBrowserLayout({
  adrs,
  currentAdr,
  children,
  backlog = false
}: AdrBrowserLayoutProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <div className={classes.appBarTitle}>
            <Link href="/" passHref>
              <MuiLink variant="h6" noWrap className={classes.appBarTitleLink}>
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
          <div className={classes.layoutLeftCol} />
          <div
            className={clsx(
              classes.layoutCenterCol,
              classes.appBarSearchContainer
            )}
          >
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

          <Typography variant="subtitle2" className={classes.adlTitle}>
            Decisions log
          </Typography>

          <AdrMenu
            adrs={adrs}
            currentAdr={currentAdr}
            className={classes.adrMenu}
          />

          <List className={classes.bottomMenuList}>
            <Divider />
            {/* <ListItem button>
              <ListItemIcon>
                <ChevronRightIcon />
              </ListItemIcon>
              <ListItemText>
                <Badge badgeContent={0} color="primary">
                  <Typography>Filters</Typography>
                </Badge>
              </ListItemText>
            </ListItem>
            <Divider /> */}
            <Link href="/decision-backlog" passHref>
              <ListItem button selected={backlog} component="a">
                <ListItemIcon>
                  <PlaylistAddCheckIcon />
                </ListItemIcon>
                <ListItemText primary="Decision backlog" />
              </ListItem>
            </Link>
          </List>
        </div>
      </Drawer>
      <div className={classes.container}>
        <Toolbar />
        <main className={classes.content}>{children}</main>
        <footer className={classes.footer}>
          <div className={classes.layoutLeftCol} />
          <div className={clsx(classes.layoutCenterCol, classes.footerContent)}>
            <Typography className={classes.footerText}>
              Powered by{" "}
              <MuiLink
                href="https://github.com/log4brains/log4brains"
                className={classes.footerLink}
                target="_blank"
                rel="noopener"
              >
                🧠 Log4brains
              </MuiLink>
            </Typography>
          </div>
          <div className={classes.layoutRightCol} />
        </footer>
      </div>
    </div>
  );
}

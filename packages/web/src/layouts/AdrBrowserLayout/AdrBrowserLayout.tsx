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
  FormatListBulleted as FormatListBulletedIcon
} from "@material-ui/icons";
import Link from "next/link";
import { AdrDto } from "@log4brains/core";
import { AdrMenu } from "./components/AdrMenu";

const drawerWidth = 450;

const useStyles = makeStyles((theme: Theme) => {
  const topSpace = theme.spacing(6);
  return createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
    titleLink: {
      display: "block",
      color: "inherit",
      "&:hover": {
        color: "inherit"
      }
    },
    center: {
      flexGrow: 1
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
    container: {
      flexGrow: 1,
      paddingTop: topSpace
    },
    content: {
      minHeight: `calc(100vh - 57px - ${topSpace + theme.spacing(8)}px)` // TODO: calc AppBar height more precisely
    },
    adlTitle: {
      fontWeight: theme.typography.fontWeightBold,
      paddingLeft: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing(3)
      },
      paddingBottom: theme.spacing(0.5)
    },
    footer: {
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.grey[600],
      height: 57,
      display: "flex",
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingRight: theme.spacing(3)
      }
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
    footerLeftGutter: {
      flexGrow: 1,
      flexShrink: 1
    },
    footerContent: {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 750,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    footerRightGutter: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 180
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
          <div className={classes.title}>
            <Link href="/" passHref>
              <MuiLink variant="h6" noWrap className={classes.titleLink}>
                Log4brains
              </MuiLink>
            </Link>
          </div>
          <div className={classes.center} />
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
        <div className={classes.drawerContainer}>
          <Toolbar />

          <Typography variant="subtitle2" className={classes.adlTitle}>
            Architecture decisions log
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
                  <FormatListBulletedIcon />
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
          <div className={classes.footerLeftGutter} />
          <div className={classes.footerContent}>
            <Typography className={classes.footerText}>
              Powered by{" "}
              <MuiLink
                href="https://github.com/log4brains/log4brains"
                className={classes.footerLink}
              >
                🧠 Log4brains
              </MuiLink>
            </Typography>
          </div>
          <div className={classes.footerRightGutter} />
        </footer>
      </div>
    </div>
  );
}

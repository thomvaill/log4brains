import { createMuiTheme, darken } from "@material-ui/core/styles";
import { colors } from "@material-ui/core";

const primary = "#556cd6";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: primary
    },
    secondary: {
      main: "#19857b"
    },
    error: {
      main: colors.red.A400
    },
    background: {
      default: "#fff"
    }
  },
  props: {
    MuiLink: {
      underline: "none"
    }
  },
  overrides: {
    MuiLink: {
      root: {
        "&:hover": {
          color: darken(primary, 0.3)
        }
      }
    }
  }
});

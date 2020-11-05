import { createMuiTheme, darken, Theme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

export type CustomTheme = Theme & {
  custom: {
    layout: {
      centerColBasis: number;
      rightColBasis: number;
    };
  };
};

const primary = "#556cd6";

export const theme: CustomTheme = {
  ...createMuiTheme({
    palette: {
      primary: {
        main: primary
      },
      secondary: {
        main: "#f50057"
      },
      error: {
        main: red.A400
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
      MuiCssBaseline: {
        "@global": {
          body: {
            padding: "0 !important" // for storybook
          }
        }
      },
      MuiLink: {
        root: {
          "&:hover": {
            color: darken(primary, 0.3)
          }
        }
      }
    }
  }),
  custom: {
    layout: {
      centerColBasis: 750,
      rightColBasis: 180
    }
  }
};

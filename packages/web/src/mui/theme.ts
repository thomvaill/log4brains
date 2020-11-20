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

const primary = "#2176AE";
const titleFontFamily = '"Roboto Slab", "Noto Serif", "Times New Roman", serif';

export const theme: CustomTheme = {
  ...createMuiTheme({
    palette: {
      primary: {
        main: primary
      },
      secondary: {
        main: "#FF007B"
      },
      error: {
        main: red.A400
      },
      background: {
        default: "#fff"
      }
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: titleFontFamily
      },
      h2: {
        fontFamily: titleFontFamily
      },
      h3: {
        fontFamily: titleFontFamily,
        lineHeight: 1.1
      },
      h4: {
        fontFamily: titleFontFamily
      },
      h5: {
        fontFamily: titleFontFamily
      },
      h6: {
        fontFamily: titleFontFamily
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

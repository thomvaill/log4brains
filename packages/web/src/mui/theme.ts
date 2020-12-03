import {
  createMuiTheme,
  darken,
  Theme,
  responsiveFontSizes
} from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

export type CustomTheme = Theme & {
  custom: {
    layout: {
      centerColBasis: number;
      centerColPadding: number;
      rightColBasis: number;
    };
  };
};

const primary = "#2176AE";
const titleFontFamily = '"Roboto Slab", "Noto Serif", "Times New Roman", serif';

export const theme: CustomTheme = {
  ...responsiveFontSizes(
    createMuiTheme({
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
            html: {
              maxWidth: "100%"
            },
            body: {
              padding: "0 !important", // for storybook
              maxWidth: "100%"
            },
            blockquote: {
              margin: 0,
              padding: "0 1em",
              borderLeft: "0.25em solid #F8F8F8",
              color: "#9e9e9e"
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
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 900,
          md: 1060,
          lg: 1280,
          xl: 1920
        }
      }
    })
  ),
  custom: {
    layout: {
      centerColBasis: 750 + 4 * 8,
      centerColPadding: 4 * 8,
      rightColBasis: 180
    }
  }
};

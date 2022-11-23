import React from "react";
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme } from "./theme";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

type Props = {
  children: React.ReactNode;
};

export function MuiDecorator({ children }: Props) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

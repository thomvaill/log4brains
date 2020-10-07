import React from "react";
import { MuiDecorator } from "../src/mui";

export const decorators = [
  (Story) => (
    <MuiDecorator>
      <Story />
    </MuiDecorator>
  )
];

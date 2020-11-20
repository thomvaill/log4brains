import React from "react";
import { MuiDecorator } from "../src/mui";
import * as nextImage from "next/image";

// Fix to make next/image work in Storybook (thanks https://stackoverflow.com/questions/64622746/how-to-mock-next-js-image-component-in-storybook)
Object.defineProperty(nextImage, "default", {
  configurable: true,
  value: (props) => {
    return <img {...props} />;
  }
});

export const decorators = [
  (Story) => (
    <MuiDecorator>
      <Story />
    </MuiDecorator>
  )
];

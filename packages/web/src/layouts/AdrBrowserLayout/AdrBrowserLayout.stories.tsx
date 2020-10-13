import React from "react";
import { Meta } from "@storybook/react";
import { AdrBrowserLayout } from "./AdrBrowserLayout";

export default {
  title: "AdrBrowserLayout",
  component: AdrBrowserLayout
} as Meta;

export function Default() {
  return <AdrBrowserLayout />;
}

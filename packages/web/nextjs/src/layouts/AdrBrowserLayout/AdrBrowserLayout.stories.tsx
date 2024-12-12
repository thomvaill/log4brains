import React from "react";
import { Meta, Story } from "@storybook/react";
import { AdrBrowserLayout, AdrBrowserLayoutProps } from "..";
import { adrMocks } from "../../../.storybook/mocks";
import { toAdrLight } from "../../lib-shared/types";

const Template: Story<AdrBrowserLayoutProps> = (args) => (
  <AdrBrowserLayout {...args} />
);

export default {
  title: "Layouts/AdrBrowser",
  component: AdrBrowserLayout
} as Meta;

export const Default = Template.bind({});
Default.args = { adrs: adrMocks.map(toAdrLight) };

export const LoadingMenu = Template.bind({});
LoadingMenu.args = {};

export const ReloadingMenu = Template.bind({});
ReloadingMenu.args = { adrs: adrMocks.map(toAdrLight), adrsReloading: true };

export const EmptyMenu = Template.bind({});
EmptyMenu.args = { adrs: [] };

export const RoutingProgressBar = Template.bind({});
RoutingProgressBar.args = { adrs: adrMocks.map(toAdrLight), routing: true };

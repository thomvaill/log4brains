import React from "react";
import { Meta, Story } from "@storybook/react";
import { AppBar, Toolbar } from "@material-ui/core";
import { SearchBox, SearchBoxProps } from "./SearchBox";
import { adrMocks } from "../../../.storybook/mocks";

const Template: Story<SearchBoxProps> = (args) => <SearchBox {...args} />;

export default {
  title: "SearchBox",
  component: SearchBox,
  decorators: [
    (DecoratedStory) => (
      <AppBar>
        <Toolbar style={{ justifyContent: "center" }}>
          <div style={{ width: 750 }}>
            <DecoratedStory />
          </div>
        </Toolbar>
      </AppBar>
    )
  ]
} as Meta;

export const Closed = Template.bind({});
Closed.args = {};

export const Open = Template.bind({});
Open.args = {
  open: true
};

export const OpenWithResults = Template.bind({});
OpenWithResults.args = {
  open: true,
  query: "Test",
  results: adrMocks.map((adr) => ({
    title: adr.title,
    href: `/adr/${adr.slug}`
  }))
};

export const OpenLoading = Template.bind({});
OpenLoading.args = {
  open: true,
  query: "test",
  results: [],
  loading: true
};

export const OpenWithoutResults = Template.bind({});
OpenWithoutResults.args = {
  open: true,
  query: "cdlifsdilhfsd",
  results: []
};

import React from "react";
import { Meta, Story } from "@storybook/react";
import { AdrStatusChip, AdrStatusChipProps } from "./AdrStatusChip";

const Template: Story<AdrStatusChipProps> = (args) => (
  <AdrStatusChip {...args} />
);

export default {
  title: "AdrStatusChip",
  component: AdrStatusChip
} as Meta;

export const Draft = Template.bind({});
Draft.args = { status: "draft" };

export const Proposed = Template.bind({});
Proposed.args = { status: "proposed" };

export const Rejected = Template.bind({});
Rejected.args = { status: "rejected" };

export const Accepted = Template.bind({});
Accepted.args = { status: "accepted" };

export const Deprecated = Template.bind({});
Deprecated.args = { status: "deprecated" };

export const Superseded = Template.bind({});
Superseded.args = { status: "superseded" };

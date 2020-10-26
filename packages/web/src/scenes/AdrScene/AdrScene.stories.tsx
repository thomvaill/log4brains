import React from "react";
import { Meta, Story } from "@storybook/react";
import { AdrScene, AdrSceneProps } from "./AdrScene";
import { adrMocks } from "../../../.storybook/mocks";

const Template: Story<AdrSceneProps> = (args) =>
  AdrScene.getLayout(<AdrScene {...args} />, args);

export default {
  title: "Scenes/ADR",
  component: AdrScene
} as Meta;

export const FirstAdr = Template.bind({});
FirstAdr.args = {
  adrs: adrMocks,
  currentAdr: adrMocks[0]
};

export const LastAdr = Template.bind({});
LastAdr.args = {
  adrs: adrMocks,
  currentAdr: adrMocks[adrMocks.length - 1]
};

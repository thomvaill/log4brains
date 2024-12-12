import React from "react";
import { Meta, Story } from "@storybook/react";
import { AdrScene, AdrSceneProps } from "./AdrScene";
import { adrMocks, getMockedAdrBySlug } from "../../../.storybook/mocks";
import { Log4brainsMode, Log4brainsModeContext } from "../../contexts";
import { toAdrLight } from "../../lib-shared/types";
import { AdrBrowserLayout } from "../../layouts";

const Template: Story<AdrSceneProps> = (args) => (
  <AdrBrowserLayout adrs={adrMocks.map(toAdrLight)} {...args}>
    <AdrScene {...args} />
  </AdrBrowserLayout>
);

export default {
  title: "Scenes/ADR",
  component: AdrScene
} as Meta;

export const FirstAdrWithLongTitle = Template.bind({});
FirstAdrWithLongTitle.args = {
  currentAdr: adrMocks[0]
};

export const LastAdr = Template.bind({});
LastAdr.args = {
  currentAdr: adrMocks[adrMocks.length - 1]
};

export const PreviewMode = Template.bind({});
PreviewMode.args = {
  currentAdr: adrMocks[adrMocks.length - 1]
};
PreviewMode.decorators = [
  (DecoratedStory) => (
    <Log4brainsModeContext.Provider value={Log4brainsMode.preview}>
      <DecoratedStory />
    </Log4brainsModeContext.Provider>
  )
];

export const LotOfDeciders = Template.bind({});
LotOfDeciders.args = {
  currentAdr: getMockedAdrBySlug("backend/20200405-lot-of-deciders")
};

export const Superseded = Template.bind({});
Superseded.args = {
  currentAdr: getMockedAdrBySlug("20200106-an-old-decision")
};

export const Superseder = Template.bind({});
Superseder.args = {
  currentAdr: getMockedAdrBySlug("20200404-a-new-decision")
};

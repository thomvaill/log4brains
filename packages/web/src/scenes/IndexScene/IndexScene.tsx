import React from "react";
import { Markdown, TwoColContent } from "../../components";
import { ConnectedAdrBrowserLayout } from "../../layouts";

export type IndexSceneProps = {
  markdown: string;
};

export function IndexScene({ markdown }: IndexSceneProps) {
  return (
    <TwoColContent>
      <Markdown>{markdown}</Markdown>
    </TwoColContent>
  );
}

IndexScene.getLayout = (scene: JSX.Element, sceneProps: IndexSceneProps) => (
  <ConnectedAdrBrowserLayout {...sceneProps}>{scene}</ConnectedAdrBrowserLayout>
);

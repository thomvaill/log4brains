import React from "react";
import { Markdown, TwoColContent } from "../../components";
import { AdrBrowserLayout } from "../../layouts";
import { AdrLight } from "../../types";

export type IndexSceneProps = {
  adrs: AdrLight[];
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
  <AdrBrowserLayout {...sceneProps}>{scene}</AdrBrowserLayout>
);

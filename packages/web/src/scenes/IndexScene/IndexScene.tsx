import React from "react";
import { AdrDto } from "@log4brains/core";
import { Markdown, TwoColContent } from "../../components";
import { AdrBrowserLayout } from "../../layouts";

export type IndexSceneProps = {
  adrs: AdrDto[];
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

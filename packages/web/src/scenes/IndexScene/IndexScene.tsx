import React from "react";
import Head from "next/head";
import { Markdown, TwoColContent } from "../../components";
import { ConnectedAdrBrowserLayout } from "../../layouts";

export type IndexSceneProps = {
  projectName: string;
  markdown: string;
  l4bVersion: string;
};

export function IndexScene({ projectName, markdown }: IndexSceneProps) {
  return (
    <>
      <Head>
        <title>{projectName} architecture knowledge base</title>
      </Head>
      <TwoColContent>
        <Markdown>{markdown}</Markdown>
      </TwoColContent>
    </>
  );
}

IndexScene.getLayout = (scene: JSX.Element, sceneProps: IndexSceneProps) => (
  <ConnectedAdrBrowserLayout {...sceneProps}>{scene}</ConnectedAdrBrowserLayout>
);

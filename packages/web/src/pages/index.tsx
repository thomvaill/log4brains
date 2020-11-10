import { GetStaticProps } from "next";
import { getIndexPageMarkdown } from "../lib";
import { IndexScene, IndexSceneProps } from "../scenes";

export default IndexScene;

export const getStaticProps: GetStaticProps<IndexSceneProps> = async () => {
  return {
    props: {
      markdown: await getIndexPageMarkdown()
    },
    revalidate: 1
  };
};

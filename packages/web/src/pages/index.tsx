import { GetStaticProps } from "next";
import { getIndexPageMarkdown, getLog4brainsInstance } from "../lib";
import { IndexScene, IndexSceneProps } from "../scenes";

export default IndexScene;

export const getStaticProps: GetStaticProps<IndexSceneProps> = async () => {
  return {
    props: {
      projectName: getLog4brainsInstance().config.project.name,
      markdown: await getIndexPageMarkdown()
    },
    revalidate: 1
  };
};

import { GetStaticProps } from "next";
import { getIndexPageMarkdown, getLog4brainsInstance } from "../lib";
import { IndexScene } from "../scenes";

export default IndexScene;

export const getStaticProps: GetStaticProps = async () => {
  const adrs = (await getLog4brainsInstance().searchAdrs()).reverse();

  return {
    props: {
      adrs,
      markdown: await getIndexPageMarkdown()
    },
    revalidate: 1
  };
};

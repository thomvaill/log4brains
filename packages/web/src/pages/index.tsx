import { GetStaticProps } from "next";
import { getIndexPageMarkdown, getLog4brainsInstance } from "../lib";
import { IndexScene } from "../scenes";
import { toAdrLight } from "../types";

export default IndexScene;

export const getStaticProps: GetStaticProps = async () => {
  const adrDtos = (await getLog4brainsInstance().searchAdrs()).reverse();

  return {
    props: {
      adrs: adrDtos.map(toAdrLight),
      markdown: await getIndexPageMarkdown()
    },
    revalidate: 1
  };
};

import { GetStaticProps, GetStaticPaths } from "next";
import { getLog4brainsInstance } from "../../lib/core-api";
import { getConfig } from "../../lib/next";
import { AdrScene, AdrSceneProps } from "../../scenes";
import { toAdr } from "../../lib-shared/types";

export default AdrScene;

export const getStaticPaths: GetStaticPaths = async () => {
  const adrs = await getLog4brainsInstance().searchAdrs();
  const paths = adrs.map((adr) => {
    return { params: { slug: adr.slug.split("/") } };
  });
  return {
    paths,
    fallback:
      process.env.LOG4BRAINS_PHASE === "initial-build" ? "blocking" : false
  };
};

export const getStaticProps: GetStaticProps<AdrSceneProps> = async ({
  params
}) => {
  const l4bInstance = getLog4brainsInstance();

  if (params === undefined || !params.slug) {
    return { notFound: true };
  }

  const currentSlug = (params.slug as string[]).join("/");
  const currentAdr = await l4bInstance.getAdrBySlug(currentSlug);
  if (!currentAdr) {
    return { notFound: true };
  }

  return {
    props: {
      projectName: l4bInstance.config.project.name,
      currentAdr: toAdr(
        currentAdr,
        currentAdr.supersededBy
          ? await l4bInstance.getAdrBySlug(currentAdr.supersededBy)
          : undefined
      ),
      l4bVersion: getConfig().serverRuntimeConfig.VERSION
    },
    revalidate: 1
  };
};

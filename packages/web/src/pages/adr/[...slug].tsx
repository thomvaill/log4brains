import { GetStaticProps, GetStaticPaths } from "next";
import io from "socket.io-client";
import { getLog4brainsInstance } from "../../lib";
import { AdrScene } from "../../scenes";
import { toAdr, toAdrLight } from "../../types";

const socket = io();

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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params === undefined) {
    return { props: {} };
  }
  const currentSlug = params.slug && (params.slug as string[]).join("/");

  const adrs = (await getLog4brainsInstance().searchAdrs())
    .reverse()
    .map(toAdr);
  const currentAdr = adrs
    .filter((adr) => {
      return adr.slug === currentSlug;
    })
    .pop();
  return {
    props: {
      adrs: adrs.map(toAdrLight),
      currentAdr,
      currentAdrSlug: currentAdr?.slug // for the layout
    },
    revalidate: 1
  };
};

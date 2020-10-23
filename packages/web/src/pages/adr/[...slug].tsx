import { GetStaticProps, GetStaticPaths } from "next";
import io from "socket.io-client";
import { AdrDto } from "@log4brains/core";
import { AdrBrowserLayout } from "../../layouts";
import { getLog4brainsInstance } from "../../lib";
import { Markdown } from "../../components";

const socket = io();

type Props = {
  adrs: AdrDto[];
  currentAdr: AdrDto;
};

export default function Adr({ currentAdr }: Props) {
  return <Markdown>{currentAdr.body.markdown}</Markdown>;
}

Adr.getLayout = (page: JSX.Element, pageProps: Props) => (
  <AdrBrowserLayout {...pageProps}>{page}</AdrBrowserLayout>
);

export const getStaticPaths: GetStaticPaths = async () => {
  const adrs = await getLog4brainsInstance().searchAdrs();
  const paths = adrs.map((adr) => {
    return { params: { slug: adr.slug.split("/") } };
  });
  return {
    paths,
    fallback: process.env.LOG4BRAINS_PHASE === "initial-build"
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params === undefined) {
    return { props: {} };
  }
  const currentSlug = params.slug && (params.slug as string[]).join("/");

  const adrs = (await getLog4brainsInstance().searchAdrs()).reverse();
  const currentAdr = adrs
    .filter((adr) => {
      return adr.slug === currentSlug;
    })
    .pop();
  return {
    props: {
      adrs,
      currentAdr
    },
    revalidate: 1
  };
};

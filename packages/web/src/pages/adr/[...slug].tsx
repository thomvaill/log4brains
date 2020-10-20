import { GetStaticProps, GetStaticPaths } from "next";
import io from "socket.io-client";
import { AdrDto } from "@log4brains/core";
import { AdrBrowserLayout } from "../../layouts";
import { l4bInstance } from "../../lib";
import { Markdown } from "../../components";

const socket = io();

type Props = {
  currentAdr: AdrDto;
};

export default function Adr({ currentAdr }: Props) {
  return <Markdown>{currentAdr.body.markdown}</Markdown>;
}

Adr.getLayout = (page, pageProps = {}) => (
  <AdrBrowserLayout {...pageProps}>{page}</AdrBrowserLayout>
);

export const getStaticPaths: GetStaticPaths = async () => {
  const adrs = await l4bInstance.searchAdrs();
  const paths = adrs.map((adr) => {
    return { params: { slug: adr.slug.split("/") } };
  });
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params === undefined) {
    return { props: {} };
  }

  const adrs = (await l4bInstance.searchAdrs()).reverse();
  const currentAdr = adrs
    .filter((adr) => {
      return adr.slug === params.slug.join("/");
    })
    .pop();
  return {
    props: {
      adrs,
      currentAdr
    }
  };
};

import { AdrDto } from "@log4brains/core";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { AdrBrowserLayout } from "../layouts";
import { getLog4brainsInstance } from "../lib";

type Props = {
  adrs: AdrDto[];
};

export default function Home({ adrs }: Props) {
  return (
    <div>
      <Head>
        <title>Architecture Log</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Hello!
    </div>
  );
}

Home.getLayout = (page: JSX.Element, pageProps: Props) => (
  <AdrBrowserLayout {...pageProps}>{page}</AdrBrowserLayout>
);

export const getStaticProps: GetStaticProps = async () => {
  const adrs = (await getLog4brainsInstance().searchAdrs()).reverse();
  return {
    props: {
      adrs
    },
    revalidate: 1
  };
};

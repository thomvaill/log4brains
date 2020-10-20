import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { AdrBrowserLayout } from "../layouts";
import { l4bInstance } from "../lib";

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

Home.getLayout = (page, pageProps = {}) => (
  <AdrBrowserLayout {...pageProps}>{page}</AdrBrowserLayout>
);

export const getStaticProps: GetStaticProps = async () => {
  const adrs = (await l4bInstance.searchAdrs()).reverse();
  return {
    props: {
      adrs
    }
  };
};

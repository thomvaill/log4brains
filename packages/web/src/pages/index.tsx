import { GetStaticProps } from "next";
import { AdrDto } from "@log4brains/core";
import Head from "next/head";
import Link from "next/link";
import { adrApi } from "../lib";
import styles from "../styles/Home.module.css";

type Props = {
  adrs: AdrDto[];
};

export default function Home({ adrs }: Props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ul>
        {adrs.map((adr) => (
          <li key={adr.slug}>
            <Link href={`/adr/${adr.slug}`}>{adr.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const adrs = await adrApi.findAll();
  return {
    props: {
      adrs
    }
  };
};

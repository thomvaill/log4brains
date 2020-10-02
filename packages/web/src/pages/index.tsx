import { GetStaticProps } from "next";
import { AdrDto } from "@log4brains/core";
import Head from "next/head";
import Link from "next/link";
import { l4bInstance } from "src/lib";
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
            <Link href={`/adr/${adr.slug}`}>
              <a>
                {adr.folder ? `${adr.folder}/` : ""}
                {adr.number} - {adr.title || "Untitled"}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const adrsRes = await l4bInstance.findAllAdrs();
  if (adrsRes.isErr()) {
    throw adrsRes.error;
  }
  const adrs = adrsRes.value;
  return {
    props: {
      adrs
    }
  };
};

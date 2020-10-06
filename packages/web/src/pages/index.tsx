import { GetStaticProps } from "next";
import { AdrDto } from "@log4brains/core";
import Head from "next/head";
import Link from "next/link";
import { l4bInstance } from "../lib";

type Props = {
  adrs: AdrDto[];
};

export default function Home({ adrs }: Props) {
  return (
    <div>
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
  const adrs = await l4bInstance.getAdrs();
  return {
    props: {
      adrs
    }
  };
};

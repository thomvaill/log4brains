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

export default function Adr({ adrs, currentAdr }: Props) {
  const currentIndex = adrs
    .map((adr, index) => (adr.slug === currentAdr.slug ? index : undefined))
    .filter((adr) => adr !== undefined)
    .pop();
  const previousAdr =
    currentIndex !== undefined && currentIndex > 0
      ? adrs[currentIndex - 1]
      : undefined;
  const nextAdr =
    currentIndex !== undefined && currentIndex < adrs.length - 1
      ? adrs[currentIndex + 1]
      : undefined;

  return (
    <Markdown
      lastEditDate={new Date(currentAdr.lastEditDate)}
      lastEditAuthor={currentAdr.lastEditAuthor}
      previousUrl={previousAdr ? `/adr/${previousAdr?.slug}` : undefined}
      nextUrl={nextAdr ? `/adr/${nextAdr?.slug}` : undefined}
      previousTitle={previousAdr?.title ?? undefined}
      nextTitle={nextAdr?.title ?? undefined}
    >
      {currentAdr.body.markdown}
    </Markdown>
  );
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

import { GetStaticProps, GetStaticPaths } from "next";
import { AdrDto } from "@log4brains/core";
import { adrApi } from "../../lib";

type Props = {
  adr: AdrDto;
};

export default function Adr({ adr }: Props) {
  return <pre>{adr.body.markdown}</pre>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const adrs = await adrApi.findAll();
  const paths = adrs.map((adr) => {
    return { params: { slug: adr.slug } };
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

  const adrs = await adrApi.findAll();
  const currentAdr = adrs
    .filter((adr) => {
      return adr.slug === params.slug;
    })
    .pop();
  return {
    props: {
      adr: currentAdr
    }
  };
};

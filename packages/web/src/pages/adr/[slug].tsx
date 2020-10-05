import { GetStaticProps, GetStaticPaths } from "next";
import { AdrDto } from "@log4brains/core";
import { l4bInstance } from "../../lib";

type Props = {
  adr: AdrDto;
};

export default function Adr({ adr }: Props) {
  return <pre>{adr.body.markdown}</pre>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const adrsRes = await l4bInstance.findAllAdrs();
  if (adrsRes.isErr()) {
    throw adrsRes.error;
  }
  const adrs = adrsRes.value as AdrDto[];
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

  const adrsRes = await l4bInstance.findAllAdrs();
  if (adrsRes.isErr()) {
    throw adrsRes.error;
  }
  const adrs = adrsRes.value as AdrDto[];

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

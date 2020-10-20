import { useEffect } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { NextComponentType, NextPageContext } from "next";
import { MuiDecorator } from "../mui";

type ComponentWithLayout<P> = NextComponentType<NextPageContext, any, P> & {
  getLayout?: (page: JSX.Element, layoutProps: any) => JSX.Element;
};
type AppPropsWithLayout<P = {}> = AppProps<P> & {
  Component: ComponentWithLayout<P>;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Remove the server-side injected CSS (@see https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js)
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    jssStyles?.parentElement?.removeChild(jssStyles);
  });

  // Persistent Layout Pattern (https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/)
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MuiDecorator>
        {getLayout(<Component {...pageProps} />, pageProps)}
      </MuiDecorator>
    </>
  );
}

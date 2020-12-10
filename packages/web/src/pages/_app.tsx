import React, { useEffect } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "highlight.js/styles/github.css";
import "../components/Markdown/hljs.css";
import { NextComponentType, NextPageContext } from "next";
import { MuiDecorator } from "../mui";
import { Log4brainsMode, Log4brainsModeContext } from "../contexts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentWithLayout<P> = NextComponentType<NextPageContext, any, P> & {
  getLayout?: (
    page: JSX.Element,
    layoutProps: Record<string, unknown>
  ) => JSX.Element;
};
type AppPropsWithLayout<P = Record<string, unknown>> = AppProps<P> & {
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

  const router = useRouter();
  const mode = process.env.NEXT_PUBLIC_LOG4BRAINS_STATIC
    ? Log4brainsMode.static
    : Log4brainsMode.preview;

  return (
    <>
      <Head>
        <title>Architecture knowledge base</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href={`${router.basePath}/favicon.ico`}
        />
        <meta
          name="og:image"
          content={`${router.basePath}/l4b-static/Log4brains-og.png`}
        />
      </Head>
      <Log4brainsModeContext.Provider value={mode}>
        <MuiDecorator>
          {getLayout(<Component {...pageProps} />, pageProps)}
        </MuiDecorator>
      </Log4brainsModeContext.Provider>
    </>
  );
}

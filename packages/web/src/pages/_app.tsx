import { useEffect } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { MuiDecorator } from "../mui";

export default function MyApp({ Component, pageProps }: AppProps) {
  // Remove the server-side injected CSS (@see https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js)
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    jssStyles?.parentElement?.removeChild(jssStyles);
  });

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
        <Component {...pageProps} />
      </MuiDecorator>
    </>
  );
}

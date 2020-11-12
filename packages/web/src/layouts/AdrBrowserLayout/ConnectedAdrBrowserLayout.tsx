import React from "react";
import Router from "next/router";
// import io from "socket.io-client"; // loaded by _document.tsx so that we don't add this lib in the static mode bundle
import type { FileWatcherEvent } from "@log4brains/core";
import { Adr, AdrLight } from "../../types";
import { Log4brainsMode, Log4brainsModeContext } from "../../contexts";
import { AdrBrowserLayout, AdrBrowserLayoutProps } from "./AdrBrowserLayout";
import {
  AdrScene,
  AdrSceneProps,
  IndexScene,
  IndexSceneProps
} from "../../scenes";

function isReactElement(
  component: React.ReactNode
): component is React.ReactElement {
  return (
    !!component &&
    typeof component === "object" &&
    "type" in component &&
    "props" in component
  );
}

function isAdrSceneChild(
  component: React.ReactNode
): component is React.ReactElement<AdrSceneProps> {
  return isReactElement(component) && component.type === AdrScene;
}

function isIndexSceneChild(
  component: React.ReactNode
): component is React.ReactElement<IndexSceneProps> {
  return isReactElement(component) && component.type === IndexScene;
}

function hasAdrMetadataChanged(previous: Adr, current: Adr): boolean {
  return (
    previous.title !== current.title ||
    previous.status !== current.status ||
    previous.package !== current.package ||
    previous.publicationDate !== current.publicationDate
  );
}

async function hotReloadCurrentPage(): Promise<void> {
  /**
   * Ugly hack of Next.JS.
   * We clear Next.JS Router's "static data cache" to make our Hot Reload feature work.
   * In fact, we trigger a page re-render every time an ADR changes and we absolutely need up-to-date data on every render.
   * So we force a new request to the server.
   */
  // @ts-ignore
  Router.router.sdc = {};

  await Router.replace(window.location.href);
}

type ConnectedAdrBrowserLayoutProps = Omit<
  AdrBrowserLayoutProps,
  "adrs" | "adrsReloading" | "routing"
>;

export function ConnectedAdrBrowserLayout(
  props: ConnectedAdrBrowserLayoutProps
) {
  const mode = React.useContext(Log4brainsModeContext);
  const [adrs, setAdrsState] = React.useState<AdrLight[]>();
  const [adrsLoading, setAdrsLoadingState] = React.useState(false);
  const [routing, setRoutingState] = React.useState(false);

  const previousProps = React.useRef<ConnectedAdrBrowserLayoutProps | null>(
    null
  );
  const latestProps = React.useRef(props);
  React.useEffect(() => {
    previousProps.current = latestProps.current;
    latestProps.current = props;
  });

  // ADRs list for the navigation
  const updateAdrsList = React.useCallback(async () => {
    setAdrsLoadingState(true);
    setAdrsState(
      await (
        await fetch(
          mode === Log4brainsMode.preview
            ? "/api/adr"
            : `/data/${process.env.NEXT_BUILD_ID}/adrs.json`
        )
      ).json()
    );
    setAdrsLoadingState(false);
  }, [mode]);

  React.useEffect(() => {
    updateAdrsList();
  }, [updateAdrsList]);

  // Routing progress bar
  Router.events.on("routeChangeStart", () => setRoutingState(true));
  Router.events.on("routeChangeComplete", () => setRoutingState(false));
  Router.events.on("routeChangeError", () => setRoutingState(false)); // TODO: show a modal?

  // Hot Reload
  React.useEffect(() => {
    if (mode !== Log4brainsMode.preview || window.io === undefined) {
      return () => {};
    }

    const socket = io();
    socket.on("FileWatcher", async (event: FileWatcherEvent) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[FileWatcher] ${event.type} - ${event.relativePath}`);
      }

      const child = React.Children.only(latestProps.current.children);
      const isMdFile = event.relativePath.toLowerCase().endsWith(".md");
      const isIndexFile = event.relativePath.toLowerCase().endsWith("index.md");

      // * HOT RELOAD
      //    - ADR page && current ADR file changed
      //    - Index page && index.md changed
      const needsHotReload =
        (isAdrSceneChild(child) &&
          child.props.currentAdr.file.relativePath.toLowerCase() ===
            event.relativePath.toLowerCase()) ||
        (isIndexSceneChild(child) && isIndexFile);
      if (needsHotReload) {
        await hotReloadCurrentPage();
      }

      // * ADR LIST UPDATE (for menu and nav)
      //    - If any .md file changed, except:
      //      - If it's index.md
      //      - If the current ADR changed (ie a Hot Reload was triggered) BUT not its metadata (title, status, date...) [for perf. reasons]
      const previousChild = previousProps.current
        ? React.Children.only(previousProps.current.children)
        : undefined;
      const currentMetadataChanged =
        isAdrSceneChild(child) &&
        previousChild &&
        isAdrSceneChild(previousChild) &&
        hasAdrMetadataChanged(
          child.props.currentAdr,
          previousChild.props.currentAdr
        );
      if (
        isMdFile &&
        !isIndexFile &&
        (!needsHotReload || currentMetadataChanged)
      ) {
        await updateAdrsList();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [mode, updateAdrsList]);

  return (
    <AdrBrowserLayout
      {...props}
      adrs={adrs}
      adrsReloading={adrs !== undefined && adrsLoading}
      routing={routing}
    />
  );
}

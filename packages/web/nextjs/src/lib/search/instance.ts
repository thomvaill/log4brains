import Router from "next/router";
import { Log4brainsMode } from "../../contexts";
import { Search, SerializedIndex } from "../../lib-shared/search";

function isSerializedIndex(obj: unknown): obj is SerializedIndex {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "lunr" in obj &&
    "adrs" in obj &&
    Array.isArray((obj as SerializedIndex).adrs)
  );
}

export async function createSearchInstance(
  mode: Log4brainsMode
): Promise<Search> {
  const index = (await (
    await fetch(
      mode === Log4brainsMode.preview
        ? `/api/search-index`
        : `${Router.basePath}/data/${process.env.NEXT_BUILD_ID}/search-index.json`
    )
  ).json()) as unknown;
  if (!isSerializedIndex(index)) {
    throw new Error(`Invalid Search SerializedIndex: ${index}`);
  }
  return Search.createFromSerializedIndex(index);
}

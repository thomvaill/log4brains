import { Log4brainsMode } from "../../contexts";
import { Search } from "./Search";

export async function createSearchInstance(
  mode: Log4brainsMode
): Promise<Search> {
  const index = await (
    await fetch(
      mode === Log4brainsMode.preview
        ? "/api/search-index"
        : `/data/${process.env.NEXT_BUILD_ID}/search-index.json`
    )
  ).json();
  return Search.createFromSerializedIndex(index);
}

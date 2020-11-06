import React from "react";
import { AutocompleteCloseReason } from "@material-ui/lab";
import { SearchBox, SearchResult } from "../../../../components/SearchBox";
import { createSearchInstance, Search } from "../../../../lib/search";
import { Adr } from "../../../../types";
import { Log4brainsMode, Log4brainsModeContext } from "../../../../contexts";

export type ConnectedSearchBoxProps = {
  /**
   * Callback fired when the search box requests to be opened.
   * Used in controlled mode (see open).
   *
   * @param event The event source of the callback.
   */
  onOpen?: (event: React.ChangeEvent<{}>) => void;

  /**
   * Callback fired when the popup requests to be closed.
   * Used in controlled mode (see open).
   *
   * @param event The event source of the callback.
   * @param reason Can be: `"toggleInput"`, `"escape"`, `"select-option"`, `"blur"`.
   */
  onClose?: (
    event: React.ChangeEvent<{}>,
    reason: AutocompleteCloseReason
  ) => void;

  /**
   * Control the popup open state.
   * Set -> controlled mode, unset -> uncontrolled mode.
   */
  open?: boolean;

  className?: string;
};

async function fetchAdr(slug: string, mode: Log4brainsMode): Promise<Adr> {
  return (
    await fetch(
      mode === Log4brainsMode.preview
        ? `/api/adr/${slug}`
        : `/data/adr/${slug}.json`
    )
  ).json();
}

export function ConnectedSearchBox({
  onOpen,
  onClose,
  open,
  className
}: ConnectedSearchBoxProps) {
  const mode = React.useContext(Log4brainsModeContext);

  const [searchInstance, setSearchInstance] = React.useState<Search>();
  const [searchQuery, setSearchQueryState] = React.useState("");
  const [searchResults, setSearchResultsState] = React.useState<SearchResult[]>(
    []
  );

  React.useEffect(() => {
    (async () => {
      setSearchInstance(await createSearchInstance(mode));
    })();
  }, [mode]);

  // TODO: improve UX with throttling, debounce and a spinner
  const handleSearchQueryChange = async (query: string): Promise<void> => {
    if (!searchInstance) {
      return; // TODO: handle this case better
    }
    setSearchQueryState(query);

    if (query.trim() === "") {
      setSearchResultsState([]);
      return;
    }

    const lunrResults = searchInstance.search(query);
    setSearchResultsState(
      await Promise.all(
        lunrResults.map(async (lunrResult) => {
          const adr = await fetchAdr(lunrResult.ref, mode);
          return {
            title: adr.title || "Undefined",
            href: `/adr/${adr.slug}`
          };
        })
      )
    );
  };

  return (
    <SearchBox
      onOpen={onOpen}
      onClose={onClose}
      open={open}
      className={className}
      onQueryChange={(_, query) => handleSearchQueryChange(query)}
      query={searchQuery}
      results={searchResults}
    />
  );
}

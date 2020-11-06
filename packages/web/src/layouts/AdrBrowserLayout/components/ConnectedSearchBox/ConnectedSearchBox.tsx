import React from "react";
import { AutocompleteCloseReason } from "@material-ui/lab";
import { SearchBox } from "../../../../components/SearchBox";
import { createSearchInstance, SearchResult } from "../../../../lib/search";
import { Adr } from "../../../../types";

export type ConnectedSearchBoxProps = {
  /**
   * ADRs to search on.
   * This component is responsible for creating the search index from them, or to load its serialized version, depending on the context.
   */
  adrs: Adr[];

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

export function ConnectedSearchBox({
  adrs,
  onOpen,
  onClose,
  open,
  className
}: ConnectedSearchBoxProps) {
  const search = React.useMemo(() => createSearchInstance(adrs), [adrs]);

  const [searchQuery, setSearchQueryState] = React.useState("");
  const [searchResults, setSearchResultsState] = React.useState<SearchResult[]>(
    []
  );

  const handleSearchQueryChange = (query: string): void => {
    setSearchQueryState(query);
    setSearchResultsState(query.trim() === "" ? [] : search.search(query));
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

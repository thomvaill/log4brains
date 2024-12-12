import React from "react";
import { SearchBox, SearchBoxProps } from "../../../../components/SearchBox";
import { createSearchInstance } from "../../../../lib/search";
import { Search, SearchResult } from "../../../../lib-shared/search";
import { Log4brainsMode, Log4brainsModeContext } from "../../../../contexts";

export type ConnectedSearchBoxProps = Omit<
  SearchBoxProps,
  "onQueryChange" | "query" | "results" | "onFocus"
>;

export function ConnectedSearchBox(props: ConnectedSearchBoxProps) {
  const mode = React.useContext(Log4brainsModeContext);

  const [searchInstance, setSearchInstance] = React.useState<Search>();
  const [pendingSearch, setPendingSearchState] = React.useState(false);
  const [searchQuery, setSearchQueryState] = React.useState("");
  const [searchResults, setSearchResultsState] = React.useState<SearchResult[]>(
    []
  );

  const handleSearchQueryChange = (query: string): void => {
    setSearchQueryState(query);

    if (query.trim() === "") {
      setSearchResultsState([]);
      return;
    }

    if (searchInstance) {
      setSearchResultsState(searchInstance.search(query));
      if (pendingSearch) {
        setPendingSearchState(false);
      }
    } else {
      setPendingSearchState(true);
    }
  };

  const handleFocus = async () => {
    // We re-create the search instance on each focus in preview mode
    if (!searchInstance || mode === Log4brainsMode.preview) {
      setSearchInstance(await createSearchInstance(mode));
    }
  };

  // Trigger a possible pending search after setting the search instance
  if (pendingSearch && searchInstance) {
    handleSearchQueryChange(searchQuery);
  }

  return (
    <SearchBox
      {...props}
      onQueryChange={(_, query) => handleSearchQueryChange(query)}
      query={searchQuery}
      results={searchResults}
      onFocus={handleFocus}
      loading={pendingSearch}
    />
  );
}

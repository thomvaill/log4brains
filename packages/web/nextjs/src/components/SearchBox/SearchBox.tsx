/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import {
  Autocomplete,
  AutocompleteCloseReason,
  AutocompleteInputChangeReason,
  AutocompleteProps
} from "@material-ui/lab";
import { CircularProgress, SvgIcon, Typography } from "@material-ui/core";
import { useControlled } from "@material-ui/core/utils";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { GrDocumentText as AdrIcon } from "react-icons/gr";
import { useRouter } from "next/router";
import { SearchBar } from "./components/SearchBar";
import { SearchResult } from "../../lib-shared/search";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    searchBar: {
      zIndex: "inherit"
    },
    resultTitle: {
      marginLeft: "0.5ch"
    },
    acPaper: {
      borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
      marginTop: 0
    }
  });
});

export type SearchBoxProps = Omit<
  AutocompleteProps<SearchResult, false, false, false>,
  "results" | "renderInput" | "options"
> & {
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

  /**
   * Callback fired when the search query changes.
   * Controlled mode only.
   *
   * @param event The event source of the callback.
   * @param query The new value of the search query.
   * @param reason Can be: `"input"` (user input), `"reset"` (programmatic change), `"clear"`.
   */
  onQueryChange?: (
    event: React.ChangeEvent<{}>,
    query: string,
    reason: AutocompleteInputChangeReason
  ) => void;

  /**
   * The search query.
   * Controlled mode only.
   */
  query?: string;

  /**
   * The search results.
   * Controlled mode only.
   */
  results?: SearchResult[];

  /**
   * To display a spinner.
   */
  loading?: boolean;
};

export function SearchBox(props: SearchBoxProps) {
  const classes = useStyles();

  const {
    onOpen,
    onClose,
    open: openProp,
    onQueryChange,
    query,
    results,
    loading = false,
    ...otherProps
  } = props;

  const [open, setOpenState] = useControlled({
    controlled: openProp,
    default: false,
    name: "SearchBox",
    state: "open"
  });

  const handleOpen = (event: React.ChangeEvent<{}>) => {
    if (open) {
      return;
    }
    setOpenState(true);
    if (onOpen) {
      onOpen(event);
    }
  };

  const router = useRouter();

  const handleClose = (
    event: React.ChangeEvent<{}>,
    reason: AutocompleteCloseReason
  ) => {
    if (!open) {
      return;
    }
    setOpenState(false);
    if (onClose) {
      onClose(event, reason);
    }
  };

  let noOptionsText: React.ReactNode = "Type to start searching";
  if (loading) {
    noOptionsText = (
      <div style={{ textAlign: "center" }}>
        <CircularProgress size={20} />
      </div>
    );
  } else if (query) {
    noOptionsText = "No matching documents";
  }

  return (
    <Autocomplete
      {...otherProps}
      classes={{ paper: classes.acPaper }}
      options={results ?? []}
      getOptionLabel={(result) => result.title}
      renderInput={(params) => (
        <SearchBar
          {...params}
          open={open}
          onClear={(event) =>
            onQueryChange && onQueryChange(event, "", "clear")
          }
          className={classes.searchBar}
        />
      )}
      inputValue={query}
      onInputChange={(event, value, reason) => {
        // We don't want to replace the inputValue by the selected value
        if (reason !== "reset" && onQueryChange) {
          onQueryChange(event, value, reason);
        }
      }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      filterOptions={(r) => r} // We hijack Autocomplete's behavior to display search results as options
      renderOption={(result) => (
        <>
          <SvgIcon fontSize="small">
            <AdrIcon />
          </SvgIcon>
          <Typography className={classes.resultTitle}>
            {result.title}
          </Typography>
        </>
      )}
      noOptionsText={noOptionsText}
      onChange={async (_, result) => {
        if (result) {
          await router.push(result.href);
        }
      }}
    />
  );
}

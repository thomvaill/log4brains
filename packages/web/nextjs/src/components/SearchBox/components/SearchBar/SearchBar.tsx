/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import {
  InputBase,
  InputAdornment,
  InputBaseProps,
  IconButton,
  Fade
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  fade
} from "@material-ui/core/styles";
import { Search as SearchIcon, Close as ClearIcon } from "@material-ui/icons";
import { AutocompleteRenderInputParams } from "@material-ui/lab";

export type SearchBarProps = InputBaseProps &
  AutocompleteRenderInputParams & {
    open: boolean;
    onClear: (event: React.ChangeEvent<{}>) => void;
  };

// Inspired by https://material-ui.com/components/app-bar/#app-bar-with-search-field
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    inputRoot: ({ open }: SearchBarProps) => ({
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      borderRadius: open
        ? `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`
        : `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
      color: open
        ? theme.palette.getContrastText(theme.palette.common.white)
        : "inherit",
      backgroundColor: open
        ? theme.palette.common.white
        : fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: open
          ? theme.palette.common.white
          : fade(theme.palette.common.white, 0.25)
      }
    }),
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0)
    },
    clearIcon: {
      color: "inherit"
    }
  });
});

export function SearchBar(props: SearchBarProps) {
  const { InputProps, InputLabelProps, open, onClear, ...params } = props;
  const classes = useStyles(props);
  return (
    <InputBase
      placeholder="Search..."
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput
      }}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      endAdornment={
        // eslint-disable-next-line react/destructuring-assignment
        <Fade in={open && props.inputProps.value !== ""}>
          <InputAdornment position="end">
            <IconButton
              onClick={(event) => onClear(event)}
              size="small"
              title="Clear"
              className={classes.clearIcon}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        </Fade>
      }
      ref={InputProps.ref}
      {...params}
    />
  );
}

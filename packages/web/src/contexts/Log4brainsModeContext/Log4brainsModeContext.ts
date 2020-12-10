import React from "react";

export enum Log4brainsMode {
  preview = "preview",
  static = "static"
}

export const Log4brainsModeContext = React.createContext(Log4brainsMode.static);

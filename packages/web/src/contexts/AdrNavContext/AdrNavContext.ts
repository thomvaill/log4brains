import React from "react";
import { AdrLight } from "../../types";

export type AdrNav = {
  previousAdr?: AdrLight;
  nextAdr?: AdrLight;
};

export const AdrNavContext = React.createContext<AdrNav>({});

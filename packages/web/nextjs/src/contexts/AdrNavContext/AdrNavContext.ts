import React from "react";
import { AdrLight } from "../../lib-shared/types";

export type AdrNav = {
  previousAdr?: AdrLight;
  nextAdr?: AdrLight;
};

export const AdrNavContext = React.createContext<AdrNav>({});

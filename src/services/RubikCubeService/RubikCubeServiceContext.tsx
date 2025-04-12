"use client";

import { Cube } from "@/models";
import { createContext, RefObject } from "react";

export interface RubikCubeServiceContent {
  cube: RefObject<Cube | null>;
}

export const RubikCubeServiceContext = createContext<RubikCubeServiceContent>({
  cube: { current: null },
});

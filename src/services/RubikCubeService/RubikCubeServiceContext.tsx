"use client";

import { Cube } from "@/models";
import { createContext, RefObject } from "react";

export interface RubikCubeServiceContent {
  cube: RefObject<Cube | null>;
  frontFace: string;
  setFrontFace: (color: string) => void;
}

export const RubikCubeServiceContext = createContext<RubikCubeServiceContent>({
  cube: { current: null },
  frontFace: "ff0000",
  setFrontFace: (color: string) => {},
});

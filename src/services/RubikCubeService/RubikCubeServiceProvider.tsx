"use client";

import { Cube } from "@/models";
import { RubikCubeServiceProviderProps } from "./RubikCubeService.types";
import { RubikCubeServiceContext } from "./RubikCubeServiceContext";
import { useEffect, useRef } from "react";

const RubikCubeServiceProvider = (props: RubikCubeServiceProviderProps) => {
  // Hooks
  const cube = useRef<Cube | null>(null);

  //Effects
  useEffect(() => {
    console.log("go");
    const handleKeyDown = (event: KeyboardEvent) => {
      const moves = ["R", "L", "U", "D", "F", "B", "M", "E", "S"];

      console.log(event.key, cube.current);
      if (moves.includes(event.key.toUpperCase())) {
        cube.current?.rotate(
          `${event.key.toUpperCase()}${event.shiftKey ? "prime" : ""}`
        )();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <RubikCubeServiceContext.Provider
      value={{
        cube,
      }}
    >
      {props.children}
    </RubikCubeServiceContext.Provider>
  );
};

export default RubikCubeServiceProvider;

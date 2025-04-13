"use client";

import { Cube } from "@/models";
import { RubikCubeServiceProviderProps } from "./RubikCubeService.types";
import { RubikCubeServiceContext } from "./RubikCubeServiceContext";
import { useEffect, useRef, useState } from "react";

const RubikCubeServiceProvider = (props: RubikCubeServiceProviderProps) => {
  //States
  const [frontFace, setFrontFace] = useState<string>("ff0000");

  // Hooks
  const cube = useRef<Cube | null>(null);

  //Effects
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        event.ctrlKey
      ) {
        return;
      }

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
        frontFace,
        setFrontFace,
      }}
    >
      {props.children}
    </RubikCubeServiceContext.Provider>
  );
};

export default RubikCubeServiceProvider;

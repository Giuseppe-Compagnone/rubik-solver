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

  useEffect(() => {
    const faviconUrl = `/images/meta/favicons/${frontFace}.png`;
    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");

    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = faviconUrl;

    document.getElementsByTagName("head")[0].appendChild(link);
  }, [frontFace]);

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

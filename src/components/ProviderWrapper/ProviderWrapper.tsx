"use client";

import { RubikCubeServiceProvider } from "@/services";
import { ProviderWrapperProps } from "./ProviderWrapper.types";

const ProviderWrapper = (props: ProviderWrapperProps) => {
  return <RubikCubeServiceProvider>{props.children}</RubikCubeServiceProvider>;
};

export default ProviderWrapper;

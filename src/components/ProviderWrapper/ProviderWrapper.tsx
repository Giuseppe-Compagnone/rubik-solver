"use client";

import { RubikCubeServiceProvider } from "@/services";
import { ProviderWrapperProps } from "./ProviderWrapper.types";
import { ToastContainer } from "react-toastify";

const ProviderWrapper = (props: ProviderWrapperProps) => {
  return (
    <RubikCubeServiceProvider>
      {props.children}
      <ToastContainer />
    </RubikCubeServiceProvider>
  );
};

export default ProviderWrapper;

import { useContext } from "react";
import { RubikCubeServiceContext } from "./RubikCubeServiceContext";

export const useRubikCubeService = () => {
  const context = useContext(RubikCubeServiceContext);

  if (!context) {
    throw new Error(
      "`useRubikCubeService` must be used within a `RubikCubeServiceProvider`"
    );
  }

  return context;
};

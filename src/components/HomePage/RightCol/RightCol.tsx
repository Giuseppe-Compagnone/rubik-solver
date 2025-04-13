"use client";

import Collapsible from "react-collapsible";
import { RightColProps } from "./RightCol.types";
import layersMethod from "./../../../utils/layersMethod.json";
import Button from "@/components/Button";
import { useRubikCubeService } from "@/services";
import { useEffect, useState } from "react";

const RightCol = (props: RightColProps) => {
  //States
  const [isClient, setIsClient] = useState<boolean>(false);

  //Hooks
  const { cube } = useRubikCubeService();

  //Effects
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="right-col">
      <span>Layers Method</span>
      {isClient &&
        layersMethod.map((phase, i) => {
          return (
            <Collapsible key={i} trigger={phase.phase} className="collapsible">
              {phase.algorithms.map((algorithm, j) => {
                return (
                  <Button
                    key={j}
                    text={algorithm.name}
                    onClick={() => {
                      cube.current?.applyAlgorithm(algorithm.algorithm);
                    }}
                  />
                );
              })}
            </Collapsible>
          );
        })}
    </div>
  );
};

export default RightCol;

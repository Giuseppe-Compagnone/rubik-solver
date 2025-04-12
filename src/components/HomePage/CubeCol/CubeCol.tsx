"use client";

import { useRubikCubeService } from "@/services";
import { CubeColProps } from "./CubeCol.types";
import { Canvas } from "@react-three/fiber";
import { RubiksCube } from "./components";
import Button from "@/components/Button";

const CubeCol = (props: CubeColProps) => {
  //Hooks
  const { cube } = useRubikCubeService();

  return (
    <div className="cube-col">
      <Canvas className="canvas">
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} />
        <RubiksCube />
      </Canvas>
      <div className="moves">
        {[
          "R",
          "Rprime",
          "L",
          "Lprime",
          "U",
          "Uprime",
          "D",
          "Dprime",
          "F",
          "Fprime",
          "B",
          "Bprime",
          "M",
          "Mprime",
          "E",
          "Eprime",
          "S",
          "Sprime",
        ].map((move, i) => {
          return (
            <Button
              key={i}
              text={move.replace("prime", "'")}
              onClick={function (): void {
                cube.current?.rotate(move)();
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CubeCol;

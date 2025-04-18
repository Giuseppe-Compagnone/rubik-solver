"use client";
import { useState } from "react";
import { LeftColProps } from "./LeftCol.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useRubikCubeService } from "@/services";
import { NotificationHandler } from "@/utils";
import Button from "@/components/Button";

const LeftCol = (props: LeftColProps) => {
  //States
  const [algorithm, setAlgorithm] = useState<string>("");

  //Hooks
  const { cube, solve } = useRubikCubeService();

  //Methods
  const handleAlgorithm = () => {
    if (algorithm.trim() === "") return;
    if (
      !/^([RLMUDBESF](?:'?\d*)\s)*[RLMUDBESF](?:'?\d*)$/.test(algorithm.trim())
    ) {
      NotificationHandler.instance.error("Invalid algorithm format");
      return;
    }
    cube.current?.applyAlgorithm(algorithm);
    setAlgorithm("");
  };

  return (
    <div className="left-col">
      <Button
        text={"Solve"}
        onClick={() => {
          if (cube.current) {
            console.log(solve(cube.current.getState()));
          }
        }}
      />
      <div className="bottom-section">
        <label htmlFor="algorithm" className="label">
          Insert a scramble
        </label>
        <div className="wrapper">
          <input
            name="algorithm"
            value={algorithm}
            onChange={(e) => {
              e.preventDefault();
              setAlgorithm(e.target.value.toUpperCase());
            }}
            placeholder="F2 R' U R U2 L2 D2 L U2 L D2 F2 L F2 D' B L F' L' U F'"
          />
          <FontAwesomeIcon
            icon={faArrowUp}
            className="icon"
            onClick={() => {
              handleAlgorithm();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LeftCol;

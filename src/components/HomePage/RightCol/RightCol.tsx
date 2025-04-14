"use client";

import Collapsible from "react-collapsible";
import { RightColProps } from "./RightCol.types";
import methods from "./../../../utils/Methods.json";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import AlgorithmButton from "@/components/AlgorithmButton";

const RightCol = (props: RightColProps) => {
  //States
  const [isClient, setIsClient] = useState<boolean>(false);

  //Effects
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="right-col">
      <h1 className="title">Resolution Methods</h1>
      {isClient &&
        methods.map((method, i) => {
          return (
            <Collapsible
              key={i}
              trigger={
                <div className="trigger">
                  <h2>{method.method}</h2>
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
              }
              openedClassName="method"
              className="method"
              contentInnerClassName="content"
            >
              {method.phases.map((phase, j) => {
                return (
                  <Collapsible
                    key={j}
                    trigger={
                      <div className="trigger">
                        <h3>{phase.phase}</h3>
                        <FontAwesomeIcon icon={faChevronDown} />
                      </div>
                    }
                    className="collapsible"
                    openedClassName="collapsible"
                    contentInnerClassName={`algorithms ${
                      phase.algorithms.length > 0 ? "" : "none"
                    }`}
                  >
                    {phase.algorithms.length > 0 ? (
                      phase.algorithms.map((algorithm, k) => {
                        return (
                          <AlgorithmButton
                            key={k}
                            name={algorithm.name}
                            algorithm={algorithm.algorithm}
                            image={"https://picsum.photos/200/200"}
                          />
                        );
                      })
                    ) : (
                      <span className="none">No Algorithms</span>
                    )}
                  </Collapsible>
                );
              })}
            </Collapsible>
          );
        })}
    </div>
  );
};

export default RightCol;

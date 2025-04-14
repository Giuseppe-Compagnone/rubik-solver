import { useRubikCubeService } from "@/services";
import { AlgorithmButtonProps } from "./AlgorithmButton.types";
import Image from "next/image";

const AlgorithmButton = (props: AlgorithmButtonProps) => {
  //Hooks
  const { cube } = useRubikCubeService();

  return (
    <div
      className="algorithm-button"
      onClick={() => {
        cube.current?.applyAlgorithm(props.algorithm);
      }}
    >
      <Image
        className="image"
        src={props.image}
        alt={props.name}
        width={64}
        height={64}
      />
      <h3 className="name">{props.name}</h3>
    </div>
  );
};

export default AlgorithmButton;

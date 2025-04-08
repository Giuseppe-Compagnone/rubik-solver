import { useLoader, useThree } from "@react-three/fiber";
import { RubikCubeProps } from "./RubikCube.types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";

const RubikCube = (props: RubikCubeProps) => {
  //Hooks
  const gltf = useLoader(GLTFLoader, "/models/rubik-cube/rubik-cube.gltf");
  const controlsRef = useRef(null);
  const { camera } = useThree();

  //Effects
  useEffect(() => {
    camera.position.set(-3, 3, -3);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <primitive
        object={gltf.scene}
        scale={0.01}
        rotation={[0, 0, Math.PI / 2]}
      />
      <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} />
    </>
  );
};

export default RubikCube;

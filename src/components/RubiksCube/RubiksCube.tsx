import { OrbitControls } from "@react-three/drei";
import { RubiksCubeProps } from "./RubiksCube.types";
import { useEffect, useRef, useState } from "react";
import { Cube } from "@/models";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const RubiksCube = (props: RubiksCubeProps) => {
  //States
  const [cube, setCube] = useState<Cube | null>(null);

  //Hooks
  const sceneRef = useRef<THREE.Scene>(null);
  const controlsRef = useRef(null);
  const { camera } = useThree();

  //Effects
  useEffect(() => {
    const timer = setInterval(() => {
      if (sceneRef.current) {
        const c = new Cube(sceneRef.current);
        console.table(c.blocks);
        c.rotate("R")();
        setTimeout(() => {
          c.rotate("L")();
        }, 500);
        setCube(c);
        clearInterval(timer);
      }
    }, 200);

    return () => clearInterval(timer);
  }, [sceneRef.current]);

  useEffect(() => {
    camera.position.set(-3, 3, -3);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <scene ref={sceneRef} />
      <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} />
    </>
  );
};

export default RubiksCube;

"use client";

import { OrbitControls } from "@react-three/drei";
import { RubiksCubeProps } from "./RubiksCube.types";
import { useEffect, useRef } from "react";
import { Cube } from "@/models";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRubikCubeService } from "@/services";

const RubiksCube = (props: RubiksCubeProps) => {
  //Hooks
  const sceneRef = useRef<THREE.Scene>(null);
  const controlsRef = useRef(null);
  const { camera } = useThree();
  const { cube, setFrontFace } = useRubikCubeService();
  const lastDirection = useRef<THREE.Vector3>(new THREE.Vector3());

  useFrame(() => {
    const currentDirection = new THREE.Vector3();
    camera.getWorldDirection(currentDirection);

    if (!currentDirection.equals(lastDirection.current) && cube.current) {
      lastDirection.current.copy(currentDirection);
      setFrontFace(cube.current.getFrontFace(currentDirection));
    }
  });

  //Effects
  useEffect(() => {
    const timer = setInterval(() => {
      if (sceneRef.current) {
        const c = new Cube(sceneRef.current);
        cube.current = c;
        clearInterval(timer);
      }
    }, 200);

    return () => clearInterval(timer);
  }, [sceneRef.current]);

  useEffect(() => {
    camera.position.set(-3, 3, 3);
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

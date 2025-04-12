"use client";

import { RubiksCube } from "@/components";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <div>
      <Canvas
        style={{
          height: "100vh",
          width: "100vh",
          margin: "0 auto",
          maxHeight: "100vw",
          maxWidth: "100vw",
        }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} />
        <RubiksCube />
      </Canvas>
    </div>
  );
}

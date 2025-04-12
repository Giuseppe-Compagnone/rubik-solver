"use client";

import { CubeCol } from "@/components";
import { useRubikCubeService } from "@/services";

export default function Home() {
  return (
    <div className="home-page">
      <div className=""></div>
      <CubeCol />
      <div className=""></div>
    </div>
  );
}

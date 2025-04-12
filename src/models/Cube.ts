import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/Addons.js";

export class Cube {
  order: number;
  pieceSize: number;
  colors: number[];
  blocks: any[][][];
  scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.order = 3;
    this.pieceSize = 1;
    this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff8c00, 0xffffff];
    this.scene = scene;

    this.blocks = Array.from({ length: this.order }, () =>
      Array.from({ length: this.order }, () =>
        Array.from({ length: this.order }, () => ({}))
      )
    );

    this.createPieces();
  }

  createPieces() {
    const gap = 1.01;
    const skinProjection = -0.101;

    const materialBox = new THREE.MeshStandardMaterial({
      color: 0x111111,
      side: THREE.DoubleSide,
      roughness: 0.8,
    });
    const materials = this.colors.map(
      (color) =>
        new THREE.MeshStandardMaterial({
          color,
          side: THREE.DoubleSide,
          roughness: 0.8,
        })
    );

    for (let i = 0; i < this.order; i++) {
      for (let j = 0; j < this.order; j++) {
        for (let k = 0; k < this.order; k++) {
          const geometryBox = new RoundedBoxGeometry(
            this.pieceSize,
            this.pieceSize,
            this.pieceSize,
            5,
            0.1
          );

          const geometryFace = new RoundedBoxGeometry(
            this.pieceSize * 0.9,
            this.pieceSize * 0.9,
            0.3,
            5,
            5
          );

          const faceL = new THREE.Mesh(geometryFace, materials[4]); // Orange
          const faceR = new THREE.Mesh(geometryFace, materials[0]); // Red
          const faceF = new THREE.Mesh(geometryFace, materials[1]); // Green
          const faceB = new THREE.Mesh(geometryFace, materials[2]); // Blue
          const faceD = new THREE.Mesh(geometryFace, materials[3]); // Yellow
          const faceU = new THREE.Mesh(geometryFace, materials[5]); // White
          const box = new THREE.Mesh(geometryBox, materialBox);

          // Rotations
          faceU.rotation.set(degree(90), 0, 0);
          faceD.rotation.set(degree(90), 0, 0);
          faceF.rotation.set(0, 0, degree(90));
          faceB.rotation.set(0, 0, degree(90));
          faceL.rotation.set(0, degree(90), 0);
          faceR.rotation.set(0, degree(90), 0);

          // Positioning
          const x = i - (this.order - 1) / 2;
          const y = j - (this.order - 1) / 2;
          const z = k - (this.order - 1) / 2;

          faceU.position.set(
            x * gap,
            y * gap + (this.pieceSize / 2 + skinProjection),
            z * gap
          );
          faceD.position.set(
            x * gap,
            y * gap - (this.pieceSize / 2 + skinProjection),
            z * gap
          );
          faceF.position.set(
            x * gap,
            y * gap,
            z * gap + (this.pieceSize / 2 + skinProjection)
          );
          faceB.position.set(
            x * gap,
            y * gap,
            z * gap - (this.pieceSize / 2 + skinProjection)
          );
          faceL.position.set(
            x * gap - (this.pieceSize / 2 + skinProjection),
            y * gap,
            z * gap
          );
          faceR.position.set(
            x * gap + (this.pieceSize / 2 + skinProjection),
            y * gap,
            z * gap
          );
          box.position.set(x * gap, y * gap, z * gap);

          const pieceGroup = new THREE.Object3D();

          // External faces
          if (
            i === 0 ||
            j === 0 ||
            k === 0 ||
            i === this.order - 1 ||
            j === this.order - 1 ||
            k === this.order - 1
          ) {
            if (i === this.order - 1) pieceGroup.add(faceR);
            if (i === 0) pieceGroup.add(faceL);
            if (j === this.order - 1) pieceGroup.add(faceU);
            if (j === 0) pieceGroup.add(faceD);
            if (k === this.order - 1) pieceGroup.add(faceF);
            if (k === 0) pieceGroup.add(faceB);

            pieceGroup.add(box);
            pieceGroup.name = `${i}${j}${k}`;
            this.scene.add(pieceGroup);
            this.blocks[i][j][k].piece = pieceGroup;
          }
        }
      }
    }
  }
}

const degree = (deg: number): number => {
  return (deg * Math.PI) / 180;
};

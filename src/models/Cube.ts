import { degree, sleep } from "@/utils";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/Addons.js";

export class Cube {
  order: number;
  pieceSize: number;
  colors: number[];
  blocks: any[][][];
  scene: THREE.Scene;
  rotating: boolean;
  front: string;

  constructor(scene: THREE.Scene) {
    this.order = 3;
    this.pieceSize = 1;
    this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff8c00, 0xffffff];
    this.scene = scene;
    this.front = "B";

    this.blocks = Array.from({ length: this.order }, () =>
      Array.from({ length: this.order }, () =>
        Array.from({ length: this.order }, () => ({}))
      )
    );

    this.createPieces();
    this.rotating = false;
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

          const faceL = new THREE.Mesh(geometryFace, materials[2]); // Blue
          const faceR = new THREE.Mesh(geometryFace, materials[1]); // Green
          const faceF = new THREE.Mesh(geometryFace, materials[0]); // Red
          const faceB = new THREE.Mesh(geometryFace, materials[4]); // Orange
          const faceD = new THREE.Mesh(geometryFace, materials[5]); // White
          const faceU = new THREE.Mesh(geometryFace, materials[3]); // Yellow
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

  rotationMatrixHelper = (i: number, j: number, direction = "clockwise") => {
    const translationOffset = (this.order - 1) / 2;
    const translatedI = i - translationOffset;
    const translatedJ = j - translationOffset;

    const rotatedI = translatedJ * (direction === "clockwise" ? -1 : 1);
    const rotatedJ = translatedI * (direction === "clockwise" ? 1 : -1);

    const x = rotatedI + translationOffset;
    const y = rotatedJ + translationOffset;
    return { x, y };
  };

  rotateSclice = (
    axis: string,
    index: number,
    direction: string,
    del = false
  ) => {
    return new Promise((resolve) => {
      if (this.rotating) {
        console.log("Already in one rotation...!");
        return;
      }
      if (index >= this.order)
        throw new Error(
          "Rotation not possible on this index : " +
            index +
            " because maximum size is : " +
            (this.order - 1)
        );
      if ("xyz".indexOf(axis) == -1)
        throw new Error("Rotation on invalid axis: " + axis);
      let dirAngle = 0;
      const rotationAngleInterval = 10;
      const tempSclice: Record<string, string> = {};
      this.rotating = true;
      switch (axis) {
        case "x":
          dirAngle = direction === "clockwise" ? 1 : -1;
          for (let i = 0; i < this.order; i++) {
            for (let j = 0; j < this.order; j++) {
              if (del) this.scene.remove(this.blocks[index][i][j].piece);

              // Backing up
              if (!tempSclice["" + i + j])
                tempSclice["" + i + j] = this.blocks[index][i][j].piece;

              const { x, y } = this.rotationMatrixHelper(
                i,
                j,
                direction == "clockwise" ? "" : "clockwise"
              );
              this.blocks[index][i][j].piece =
                tempSclice["" + x + y] || this.blocks[index][x][y].piece;

              let totalAngle = rotationAngleInterval;

              const doRotationAnimation = () => {
                if (totalAngle == 90) {
                  this.rotating = false;
                  setTimeout(() => resolve("done"), 500);
                } else requestAnimationFrame(doRotationAnimation);

                const rotation = new THREE.Matrix4().makeRotationX(
                  degree(rotationAngleInterval * dirAngle)
                );
                this.blocks[index][i][j].piece.applyMatrix4(rotation);
                totalAngle += rotationAngleInterval;
              };
              doRotationAnimation();
            }
          }
          break;
        case "y":
          dirAngle = direction === "clockwise" ? 1 : -1;
          for (let i = 0; i < this.order; i++) {
            for (let j = 0; j < this.order; j++) {
              if (del) this.scene.remove(this.blocks[i][index][j].piece);
              // Backing up
              if (!tempSclice["" + i + j])
                tempSclice["" + i + j] = this.blocks[i][index][j].piece;

              const { x, y } = this.rotationMatrixHelper(i, j, direction);
              this.blocks[i][index][j].piece =
                tempSclice["" + x + y] || this.blocks[x][index][y].piece;

              let totalAngle = rotationAngleInterval;

              const doRotationAnimation = () => {
                if (totalAngle == 90) {
                  this.rotating = false;
                  setTimeout(() => resolve("done"), 500);
                } else requestAnimationFrame(doRotationAnimation);

                const rotation = new THREE.Matrix4().makeRotationY(
                  degree(rotationAngleInterval * dirAngle)
                );
                this.blocks[i][index][j].piece.applyMatrix4(rotation);
                totalAngle += rotationAngleInterval;
              };
              doRotationAnimation();
            }
          }
          break;
        case "z":
          dirAngle = direction === "clockwise" ? 1 : -1;
          for (let i = 0; i < this.order; i++) {
            for (let j = 0; j < this.order; j++) {
              // scene.remove(this.blocks[i][j][index].piece);
              if (del) this.scene.remove(this.blocks[i][j][index].piece);
              // Backing up
              if (!tempSclice["" + i + j])
                tempSclice["" + i + j] = this.blocks[i][j][index].piece;

              const { x, y } = this.rotationMatrixHelper(
                i,
                j,
                direction == "clockwise" ? "" : "clockwise"
              );
              this.blocks[i][j][index].piece =
                tempSclice["" + x + y] || this.blocks[x][y][index].piece;

              let totalAngle = rotationAngleInterval;

              const doRotationAnimation = () => {
                if (totalAngle == 90) {
                  this.rotating = false;
                  setTimeout(() => resolve("done"), 500);
                } else requestAnimationFrame(doRotationAnimation);

                const rotation = new THREE.Matrix4().makeRotationZ(
                  degree(rotationAngleInterval * dirAngle)
                );
                this.blocks[i][j][index].piece.applyMatrix4(rotation);
                totalAngle += rotationAngleInterval;
              };
              doRotationAnimation();
            }
          }
          break;
      }
    });
  };

  rotate = (rotation: string) => {
    const mappedMove = this.mapMove(rotation);

    const mapping: Record<string, () => {}> = {
      U: () => this.rotateSclice("y", 2, "anticlockwise"),
      Uprime: () => this.rotateSclice("y", 2, "clockwise"),
      D: () => this.rotateSclice("y", 0, "clockwise"),
      Dprime: () => this.rotateSclice("y", 0, "anticlockwise"),
      R: () => this.rotateSclice("z", 0, "clockwise"),
      Rprime: () => this.rotateSclice("z", 0, "anticlockwise"),
      L: () => this.rotateSclice("z", 2, "anticlockwise"),
      Lprime: () => this.rotateSclice("z", 2, "clockwise"),
      F: () => this.rotateSclice("x", 2, "anticlockwise"),
      Fprime: () => this.rotateSclice("x", 2, "clockwise"),
      B: () => this.rotateSclice("x", 0, "clockwise"),
      Bprime: () => this.rotateSclice("x", 0, "anticlockwise"),
      M: () => this.rotateSclice("z", 1, "anticlockwise"),
      Mprime: () => this.rotateSclice("z", 1, "clockwise"),
      E: () => this.rotateSclice("y", 1, "clockwise"),
      Eprime: () => this.rotateSclice("y", 1, "anticlockwise"),
      S: () => this.rotateSclice("x", 1, "anticlockwise"),
      Sprime: () => this.rotateSclice("x", 1, "clockwise"),
    };

    try {
      return mapping[mappedMove];
    } catch (e) {
      console.error("Invalid notation", e);
      console.log("step:", rotation);
      return () => {};
    }
  };

  getFrontFace(rotation: THREE.Vector3): string {
    const faceNormals = {
      F: new THREE.Vector3(0, 0, 1),
      B: new THREE.Vector3(0, 0, -1),
      R: new THREE.Vector3(1, 0, 0),
      L: new THREE.Vector3(-1, 0, 0),
    };

    const faceColors: Record<string, string> = {
      F: "ff8c00",
      B: "ff0000",
      R: "0000ff",
      L: "00ff00",
    };

    let maxDot = -Infinity;
    let frontFace = this.front;

    for (const [face, normal] of Object.entries(faceNormals)) {
      const dot = rotation.dot(normal);
      if (dot > maxDot) {
        maxDot = dot;
        frontFace = face;
      }
    }

    this.front = frontFace;
    console.log(frontFace);

    return faceColors[frontFace];
  }

  mapMove(move: string): string {
    const rotationMap: Record<string, Record<string, string>> = {
      F: {
        F: "R",
        R: "B",
        B: "L",
        L: "F",
        U: "U",
        D: "D",
        M: "S",
        E: "E",
        S: "Mprime",
        Fprime: "Rprime",
        Rprime: "Bprime",
        Bprime: "Lprime",
        Lprime: "Fprime",
        Uprime: "Uprime",
        Dprime: "Dprime",
        Mprime: "Sprime",
        Eprime: "Eprime",
        Sprime: "M",
      },
      R: {
        F: "B",
        R: "L",
        B: "F",
        L: "R",
        U: "U",
        D: "D",
        M: "Mprime",
        E: "E",
        S: "Sprime",
        Fprime: "Bprime",
        Rprime: "Lprime",
        Bprime: "Fprime",
        Lprime: "Rprime",
        Uprime: "Uprime",
        Dprime: "Dprime",
        Mprime: "M",
        Eprime: "Eprime",
        Sprime: "S",
      },
      B: {
        F: "L",
        R: "F",
        B: "R",
        L: "B",
        U: "U",
        D: "D",
        M: "Sprime",
        E: "E",
        S: "M",
        Fprime: "Lprime",
        Rprime: "Fprime",
        Bprime: "Rprime",
        Lprime: "Bprime",
        Uprime: "Uprime",
        Dprime: "Dprime",
        Mprime: "S",
        Eprime: "Eprime",
        Sprime: "Mprime",
      },
      L: {
        F: "F",
        R: "R",
        B: "B",
        L: "L",
        U: "U",
        D: "D",
        M: "M",
        E: "E",
        S: "S",
        Fprime: "Fprime",
        Rprime: "Rprime",
        Bprime: "Bprime",
        Lprime: "Lprime",
        Uprime: "Uprime",
        Dprime: "Dprime",
        Mprime: "Mprime",
        Eprime: "Eprime",
        Sprime: "Sprime",
      },
    };

    const currentFront = this.front;
    const mapped = rotationMap[currentFront][move];
    return mapped;
  }

  async applyAlgorithm(algorithm: string) {
    const moves = algorithm
      .replaceAll(/\b([URFDLBMESxyz])('?)(\d+)\b/g, (_, move, prime, count) => {
        const fullMove = move + prime;
        return Array(Number(count)).fill(fullMove).join(" ");
      })
      .split(" ")
      .map((move) => move.replaceAll("'", "prime"));

    for (const move of moves) {
      this.rotate(move)();
      await sleep(180);
    }
  }
}

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
    this.colors = [0x00ff00, 0xff0000, 0xff8c00, 0xffffff, 0x0000ff, 0xffff00];
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

    const halfOrder = (this.order - 1) / 2;
    const halfPiece = this.pieceSize / 2;

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

    // FRUDLB
    //F rosso,R Verde,U Giallo,D White,L Blu,B Arancio

    const faces: {
      axis: "x" | "y" | "z";
      index: number;
      rotation: [number, number, number];
      offset: [number, number, number];
      materialIndex: number;
      key: string;
    }[] = [
      {
        axis: "y",
        index: this.order - 1,
        rotation: [degree(-90), 0, 0],
        offset: [0, halfPiece + skinProjection, 0],
        materialIndex: 3,
        key: "U",
      },
      {
        axis: "y",
        index: 0,
        rotation: [degree(90), 0, 0],
        offset: [0, -halfPiece - skinProjection, 0],
        materialIndex: 5,
        key: "D",
      },
      {
        axis: "z",
        index: this.order - 1,
        rotation: [0, 0, degree(90)],
        offset: [0, 0, halfPiece + skinProjection],
        materialIndex: 0,
        key: "F",
      },
      {
        axis: "z",
        index: 0,
        rotation: [0, degree(180), degree(90)],
        offset: [0, 0, -halfPiece - skinProjection],
        materialIndex: 4,
        key: "B",
      },
      {
        axis: "x",
        index: 0,
        rotation: [0, degree(-90), 0],
        offset: [-halfPiece - skinProjection, 0, 0],
        materialIndex: 2,
        key: "L",
      },
      {
        axis: "x",
        index: this.order - 1,
        rotation: [0, degree(90), 0],
        offset: [halfPiece + skinProjection, 0, 0],
        materialIndex: 1,
        key: "R",
      },
    ];

    for (let i = 0; i < this.order; i++) {
      for (let j = 0; j < this.order; j++) {
        for (let k = 0; k < this.order; k++) {
          const x = (i - halfOrder) * gap;
          const y = (j - halfOrder) * gap;
          const z = (k - halfOrder) * gap;

          const box = new THREE.Mesh(geometryBox, materialBox);
          box.position.set(x, y, z);

          const pieceGroup = new THREE.Object3D();
          pieceGroup.add(box);
          pieceGroup.name = `${i}${j}${k}`;

          for (const face of faces) {
            const showFace =
              (face.axis === "x" && i === face.index) ||
              (face.axis === "y" && j === face.index) ||
              (face.axis === "z" && k === face.index);

            if (showFace) {
              const mesh = new THREE.Mesh(
                geometryFace,
                materials[face.materialIndex]
              );
              mesh.rotation.set(...face.rotation);
              mesh.position.set(
                x + (face.offset[0] || 0),
                y + (face.offset[1] || 0),
                z + (face.offset[2] || 0)
              );
              pieceGroup.add(mesh);
            }
          }

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
    algorithm = false,
    del = false
  ) => {
    return new Promise((resolve) => {
      if (this.rotating && !algorithm) return;
      if (index >= this.order)
        throw new Error(`Invalid index ${index}, max is ${this.order - 1}`);
      if (!"xyz".includes(axis)) throw new Error(`Invalid axis: ${axis}`);

      const dirAngle = direction === "clockwise" ? 1 : -1;
      const rotationAngleInterval = 10;
      const tempSclice: Record<string, string> = {};
      this.rotating = true;

      const applyRotation = (
        getBlock: (i: number, j: number) => any,
        setBlock: (i: number, j: number, value: any) => void,
        makeRotation: () => THREE.Matrix4,
        rotateHelperDirection: string
      ) => {
        for (let i = 0; i < this.order; i++) {
          for (let j = 0; j < this.order; j++) {
            if (del) this.scene.remove(getBlock(i, j).piece);
            const key = `${i}${j}`;
            if (!tempSclice[key]) tempSclice[key] = getBlock(i, j).piece;

            const { x, y } = this.rotationMatrixHelper(
              i,
              j,
              rotateHelperDirection
            );
            setBlock(i, j, tempSclice[`${x}${y}`] || getBlock(x, y).piece);

            let totalAngle = rotationAngleInterval;
            const doRotationAnimation = () => {
              if (totalAngle === 90) {
                if (!algorithm) this.rotating = false;
                setTimeout(() => resolve("done"), 500);
              } else requestAnimationFrame(doRotationAnimation);
              getBlock(i, j).piece.applyMatrix4(makeRotation());
              totalAngle += rotationAngleInterval;
            };
            doRotationAnimation();
          }
        }
      };

      const degRot = () => degree(rotationAngleInterval * dirAngle);
      switch (axis) {
        case "x":
          applyRotation(
            (i, j) => this.blocks[index][i][j],
            (i, j, val) => (this.blocks[index][i][j].piece = val),
            () => new THREE.Matrix4().makeRotationX(degRot()),
            direction === "clockwise" ? "" : "clockwise"
          );
          break;
        case "y":
          applyRotation(
            (i, j) => this.blocks[i][index][j],
            (i, j, val) => (this.blocks[i][index][j].piece = val),
            () => new THREE.Matrix4().makeRotationY(degRot()),
            direction
          );
          break;
        case "z":
          applyRotation(
            (i, j) => this.blocks[i][j][index],
            (i, j, val) => (this.blocks[i][j][index].piece = val),
            () => new THREE.Matrix4().makeRotationZ(degRot()),
            direction === "clockwise" ? "" : "clockwise"
          );
          break;
      }
    });
  };

  rotate = (rotation: string, algorithm: boolean = false) => {
    const mappedMove = this.mapMove(rotation);

    const mapping: Record<string, () => {}> = {
      U: () => this.rotateSclice("y", 2, "anticlockwise", algorithm),
      Uprime: () => this.rotateSclice("y", 2, "clockwise", algorithm),
      D: () => this.rotateSclice("y", 0, "clockwise", algorithm),
      Dprime: () => this.rotateSclice("y", 0, "anticlockwise", algorithm),
      R: () => this.rotateSclice("z", 0, "clockwise", algorithm),
      Rprime: () => this.rotateSclice("z", 0, "anticlockwise", algorithm),
      L: () => this.rotateSclice("z", 2, "anticlockwise", algorithm),
      Lprime: () => this.rotateSclice("z", 2, "clockwise", algorithm),
      F: () => this.rotateSclice("x", 2, "anticlockwise", algorithm),
      Fprime: () => this.rotateSclice("x", 2, "clockwise", algorithm),
      B: () => this.rotateSclice("x", 0, "clockwise", algorithm),
      Bprime: () => this.rotateSclice("x", 0, "anticlockwise", algorithm),
      M: () => this.rotateSclice("z", 1, "anticlockwise", algorithm),
      Mprime: () => this.rotateSclice("z", 1, "clockwise", algorithm),
      E: () => this.rotateSclice("y", 1, "clockwise", algorithm),
      Eprime: () => this.rotateSclice("y", 1, "anticlockwise", algorithm),
      S: () => this.rotateSclice("x", 1, "anticlockwise", algorithm),
      Sprime: () => this.rotateSclice("x", 1, "clockwise", algorithm),
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
    if (this.rotating) return this.front;
    const faceNormals = {
      F: new THREE.Vector3(0, 0, 1),
      B: new THREE.Vector3(0, 0, -1),
      R: new THREE.Vector3(1, 0, 0),
      L: new THREE.Vector3(-1, 0, 0),
    };

    const faceColors: Record<string, string> = {
      F: this.colors[0].toString(16).padStart(6, "0"),
      B: this.colors[4].toString(16).padStart(6, "0"),
      R: this.colors[2].toString(16).padStart(6, "0"),
      L: this.colors[1].toString(16).padStart(6, "0"),
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
      .trim()
      .replaceAll(/\b([URFDLBMESxyz])('?)(\d+)\b/g, (_, move, prime, count) => {
        const fullMove = move + prime;
        return Array(Number(count)).fill(fullMove).join(" ");
      })
      .split(" ")
      .map((move) => move.replaceAll("'", "prime"));

    for (const move of moves) {
      this.rotate(move, true)();
      await sleep(220);
    }

    this.rotating = false;
  }

  getState(): string {
    const stickers: Record<string, string[]> = {
      F: Array(9).fill(""),
      B: Array(9).fill(""),
      U: Array(9).fill(""),
      D: Array(9).fill(""),
      L: Array(9).fill(""),
      R: Array(9).fill(""),
    };

    const faceKeys = ["U", "D", "F", "B", "L", "R"];
    const normalMap: Record<string, THREE.Vector3> = {
      U: new THREE.Vector3(0, 1, 0),
      D: new THREE.Vector3(0, -1, 0),
      F: new THREE.Vector3(0, 0, 1),
      B: new THREE.Vector3(0, 0, -1),
      L: new THREE.Vector3(-1, 0, 0),
      R: new THREE.Vector3(1, 0, 0),
    };
    const colorToFace: Record<number, string> = {
      0x00ff00: "F",
      0xff0000: "R",
      0xff8c00: "L",
      0xffffff: "U",
      0x0000ff: "B",
      0xffff00: "D",
    };

    for (let i = 0; i < this.order; i++) {
      for (let j = 0; j < this.order; j++) {
        for (let k = 0; k < this.order; k++) {
          const piece = this.blocks[i][j][k].piece;
          piece.children.forEach((mesh: THREE.Mesh) => {
            const worldDirection = new THREE.Vector3();
            mesh.getWorldDirection(worldDirection).round();
            let faceKey = "";
            for (const key of faceKeys) {
              if (worldDirection.equals(normalMap[key])) {
                faceKey = key;

                break;
              }
            }

            if (faceKey) {
              const localPosition = new THREE.Vector3();
              piece.worldToLocal(mesh.getWorldPosition(localPosition));

              let index: number | undefined;

              switch (faceKey) {
                case "U":
                  index = (2 - k) * 3 + i;
                  break;
                case "D":
                  index = k * 3 + i;
                  break;
                case "F":
                  index = j * 3 + i;
                  break;
                case "B":
                  index = (2 - j) * 3 + i;
                  break;
                case "L":
                  index = j * 3 + (2 - k);
                  break;
                case "R":
                  index = j * 3 + k;
                  break;
              }

              // @ts-ignore
              const colorHex = mesh.material.color.getHex();
              const colorChar = colorToFace[colorHex];

              if (index !== undefined && stickers[faceKey] && colorChar) {
                stickers[faceKey][index] = colorChar;
              }
            }
          });
        }
      }
    }

    Object.keys(stickers).forEach((key) => {
      if (key === "U" || key === "D") {
        stickers[key] = [
          stickers[key][6],
          stickers[key][7],
          stickers[key][8],
          stickers[key][3],
          stickers[key][4],
          stickers[key][5],
          stickers[key][0],
          stickers[key][1],
          stickers[key][2],
        ];
      } else {
        stickers[key] = [
          stickers[key][8],
          stickers[key][7],
          stickers[key][6],
          stickers[key][5],
          stickers[key][4],
          stickers[key][3],
          stickers[key][2],
          stickers[key][1],
          stickers[key][0],
        ];
      }
    });

    console.table(stickers);
    console.log(
      (
        stickers.U.join("") +
        stickers.R.join("") +
        stickers.F.join("") +
        stickers.D.join("") +
        stickers.L.join("") +
        stickers.B.join("")
      ).toUpperCase()
    );

    return (
      stickers.U.join("") +
      stickers.R.join("") +
      stickers.F.join("") +
      stickers.D.join("") +
      stickers.L.join("") +
      stickers.B.join("")
    ).toUpperCase();
  }
}

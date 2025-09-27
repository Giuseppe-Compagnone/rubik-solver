// eslint-disable-next-line @typescript-eslint/no-require-imports
const Cube = require("cubejs");

export class Solver {
  private static _instance: Solver;

  private constructor() {}

  public static get instance(): Solver {
    if (!this._instance) {
      this._instance = new Solver();
    }

    return this._instance;
  }

  //R2 F' D2 F R2 D2 B' F2 D2 F2 D2 R' D2 B' U B R' D F2 R'
  solve(configuration: string): string {
    const scramble = Cube.fromString(configuration);

    const cube = new Cube();

    cube.init(scramble);
    Cube.initSolver();

    if (cube.isSolved()) {
      return "";
    } else {
      console.log(cube.solve());
    }

    return "";
  }
}

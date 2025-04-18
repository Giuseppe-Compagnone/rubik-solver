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

  solve(configuration: string): string {
    const scramble = Cube.fromString(
      "UUBUUBUUBRRRRRRRRRFFUFFUFFUDDFDDFDDFLLLLLLLLLDBBDBBDBB"
    );
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

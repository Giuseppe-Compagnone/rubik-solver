import { Solver } from "@/models";

self.onmessage = (e) => {
  const configuration = e.data.data;
  const solution = Solver.instance.solve(configuration);
  self.postMessage(solution);
};

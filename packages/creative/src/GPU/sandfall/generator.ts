import { Random } from "@utilities/random";
import { Config } from "./config";

export namespace Generator {
  const totalCells = Config.columns ** 2;

  function isWall(cell: number): boolean {
    if (cell < Config.columns) return true;
    if (cell > totalCells - Config.columns) return true;
    if (cell % Config.columns == 0) return true;
    if (cell % Config.columns == Config.columns - 1) return true;

    return false;
  }

  export function generate0() {
    const state: number[] = [];
    for (let i = 0; i < totalCells; i++) {
      const r = Random.rangeInt(0, 100);
      const g = 0;
      const b = 0;
      const a = 0;
      state.push(r, g, b, a);
    }

    return state;
  }

  export function generate1() {
    const state: number[] = [];
    for (let i = 0; i < totalCells; i++) {
      const r = Config.walls && isWall(i) ? 2 : 1;
      // FIX
      const g = 3000;
      const b = 0;
      const a = 0;
      state.push(r, g, b, a);
    }

    return state;
  }

  export function generate2() {
    const state: number[] = [];
    for (let i = 0; i < totalCells; i++) {
      const r = 0;
      const g = 0;
      const b = 0;
      const a = 0;
      state.push(r, g, b, a);
    }

    return state;
  }
}

export namespace Config {
  enum Grid {
    RECTANGLE,
    HEXAGON,
  }

  export enum DistanceMethod {
    EUCLIDEAN,
    MANHATTAN,
  }

  export enum Runtime {
    ANIMATED,
    INSTANT,
  }

  export const grid: Grid = Grid.RECTANGLE;

  export const runtime: Runtime = Runtime.ANIMATED;

  export const width = 600;
  export const height = 600;

  export const cols = 100;
  export const rows = 100;

  export const cellWidth = width / cols;

  export const diagonals = false;

  export const distanceMethod: DistanceMethod = DistanceMethod.EUCLIDEAN;

  export const weights = {
    moveCost: 1,
    distanceCost: 1.5,
    terrainCost: 0,
  } as const;

  export const animationStepIncrement = 0.03;

  export const colors = {
    debug: "#FF00FF",
    empty: "#313244",
    block: "#11111B",
    rough: "#116611",
    open: "#B4BEFE",
    closed: "#89B4FA",
  } as const;

  export const terrain = {
    blocks: 0.36,
    rough: 0,

    noiseScalar: 0.2,
  } as const;
}

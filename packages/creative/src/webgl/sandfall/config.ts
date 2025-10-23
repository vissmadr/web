enum Elements {
  Debug,
  Empty,
  Block,
  Sand,
  Water,
  Ice,
  Steam,
  Fire,
}

enum Spread {
  None,
  Low,
  Mid,
  High,
  Full,
}

export namespace Config {
  export const debug = false;

  export const width = 600;
  export const height = 600;

  export const columns: number = 130;
  export const walls: boolean = true;
  export const spawnerSize: number = 0.04;

  export const limitFPS: boolean = true;
  export const FPS: number = 60;

  export const borderSize: number = -0.02;

  export const maxSoakedCells: number = 2;
  export const soakPerAbsorb: number = 10;

  export const temperature = {
    absoluteZero: 0,
    waterFreeze: 2700,
    normal: 3000,
    waterBoil: 3700,
    woodBurn: 8000,
    metalMelt: 15000,
    sandMelt: 19000,
    maximum: 30000,
  } as const;

  export const temperatureSpawn = {
    debug: 3000,
    empty: 3000,
    block: 3000,
    sand: 3000,
    water: 3000,
    ice: 2000,
    steam: 3000,
    fire: 12000,
  } as const;

  export const maxThermalTransfer = {
    debug: -1,
    empty: 100,
    block: 1000,
    sand: 1000,
    water: 1000,
    ice: 1000,
    steam: 1000,
    fire: 1000,
  } as const;

  export const density = {
    debug: 0,
    empty: 0,
    block: 9,
    sand: 4,
    water: 3,
    ice: 9,
    steam: 2,
    fire: 1,
  } as const;

  export const spread = {
    debug: Spread.None,
    empty: Spread.None,
    block: Spread.None,
    sand: Spread.Low,
    water: Spread.Mid,
    ice: Spread.None,
    steam: Spread.High,
    fire: Spread.High,
  } as const;

  export enum SpawnKeys {
    NONE = -1,
    NUM_0 = Elements.Debug,
    NUM_1 = Elements.Empty,
    NUM_2 = Elements.Block,
    NUM_3 = Elements.Sand,
    NUM_4 = Elements.Water,
    NUM_5 = Elements.Ice,
    NUM_6 = Elements.Steam,
    NUM_7 = Elements.Fire,
  }
}

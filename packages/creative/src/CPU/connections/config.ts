export namespace Config {
  export const width = 600;
  export const height = 600;

  export const log = {
    quadtrees: false,
    displayedNodes: false,
  } as const;

  export const force = {
    maxVelocity: Infinity,
    center: {
      active: true,
      scalar: 0.00023,
    },
    repulsion: {
      active: true,
      scalar: 0.054,
    },
    attraction: {
      active: true,
      scalar: 0.00001,
      idealDistance: 32,
    },
    drag: {
      active: true,
      scalar: 0.98,
    },
  } as const;

  export const render = {
    background: {
      active: true,
      color: "#111111",
    },
    node: {
      display: true,
      color: "#909090",
      radius: 6,
    },
    connection: {
      display: true,
      color: "#808080AA",
      width: 2.5,
    },
    quadtree: {
      display: false,
      color: "#00EE00",
      width: 0.5,
    },
    velocity: {
      display: false,
      color: "#FF00FF",
      width: 1.0,
      scalar: 10,
    },
    target: {
      node: "#FFCC11",
      connected: "#FFCC11",
      connection: "#FFBB11",
    },
  } as const;

  export const quadtree = {
    capacity: 10,
  } as const;

  export const nodes = {
    spawn: {
      active: true,
      count: 300,
    },
    connect: {
      active: true,
      chance: 0.5,
      count: {
        min: 1,
        max: 3,
      },
    },
  } as const;
}

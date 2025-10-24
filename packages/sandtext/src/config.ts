export const defaultConfig = {
  FPS: 30,

  timeIncrement: 0.003,

  particleSize: {
    min: 0.5,
    max: 3.0,
  },

  returnSpeed: {
    min: 0.1,
    max: 0.34,
  },

  noiseFrequency: 10,
  noiseScalar: {
    min: 0.0018,
    max: 0.0030,
  },
} as const;

export type Config = typeof defaultConfig;

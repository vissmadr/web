export const defaultConfig = {
  imageWidth: 480,
  imageHeight: 141,

  FPS: 30,

  timeIncrement: 0.007,

  particleSize: {
    min: 0.5,
    max: 3.0,
  },

  returnSpeed: {
    min: 0.16,
    max: 0.32,
  },

  noiseFrequency: 8,
  noiseScalar: {
    min: 0.0005,
    max: 0.005,
  },
} as const;

export type Config = typeof defaultConfig;

export const defaultConfig = {
  width: 480,
  height: 600,

  imageWidth: 480,
  imageHeight: 600,

  cachedParticles: 500,
  lifetime: 220,
  decay: 2.2,
  size: 0.006,
  speed: 1,

  noiseFrequency: 0.04,
  noiseEffect: 0.14,

  backgroundColor: "#161616",
};

export type Config = typeof defaultConfig;

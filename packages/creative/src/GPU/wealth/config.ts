export const defaultConfig = {
  width: 600,
  height: 600,

  size: {
    min: 0.3,
    max: 2.6,
  },

  returnSpeed: {
    min: 0.010,
    max: 0.036,
  },

  repelRadius: 0.07,
  repelSpeed: 0.003,

  noiseFrequency: 4,
  timeIncrement: 0.001,
  textNoiseEffect: 0.0001,
  messNoiseEffect: 0.00003,

  textSize: 38,
  textLineHeight: 42,
  textY: 0.16,
  textMaxWidth: 460,
  text: "They clamor for gold, begging us to turn their leaden coins to wealth. Little do they know, we who master the Art seek to transmute something far more precious. They think our Art is about turning lead into gold, when truly it is about turning fools into sages.",
} as const;

export type Config = typeof defaultConfig;

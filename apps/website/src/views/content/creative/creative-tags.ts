export enum TagNames {
  "3D",
  Input,
  GPU,
  Noise,
  Particles,
  Image,
  Pathfinding,
  Collision,
  Random,
  ASCII,
  Automata,
  Bright,
  Education,
  Physics
}

export type TagData = {
  label: string;
  color: string;
  fontColor: string;
};

export const creativeTags: Record<TagNames, TagData> = {
  [TagNames["3D"]]: {
    label: "3D",
    color: "#118888",
    fontColor: "#FFFFFF",
  },

  [TagNames.Input]: {
    label: "Input",
    color: "#11A011",
    fontColor: "#FFFFFF",
  },

  [TagNames.GPU]: {
    label: "GPU",
    color: "#DD1111",
    fontColor: "#FFFFFF",
  },

  [TagNames.Noise]: {
    label: "Noise",
    color: "#A08070",
    fontColor: "#FFFFFF",
  },

  [TagNames.Education]: {
    label: "Education",
    color: "#127FDE",
    fontColor: "#FFFFFF",
  },

  [TagNames.Particles]: {
    label: "Particles",
    color: "#FF8010",
    fontColor: "#FFFFFF",
  },

  [TagNames.Image]: {
    label: "Image",
    color: "#D56065",
    fontColor: "#FFFFFF",
  },

  [TagNames.Pathfinding]: {
    label: "Pathfinding",
    color: "#2040B1",
    fontColor: "#FFFFFF",
  },

  [TagNames.Collision]: {
    label: "Collision",
    color: "#9163F2",
    fontColor: "#FFFFFF",
  },

  [TagNames.Random]: {
    label: "Random",
    color: "#6E915F",
    fontColor: "#FFFFFF",
  },

  [TagNames.ASCII]: {
    label: "ASCII",
    color: "#666666",
    fontColor: "#FFFFFF",
  },

  [TagNames.Automata]: {
    label: "Automata",
    color: "#AA11AA",
    fontColor: "#FFFFFF",
  },

  [TagNames.Bright]: {
    label: "Bright",
    color: "#DDDDDD",
    fontColor: "#111111",
  },

  [TagNames.Physics]: {
    label: "Physics",
    color: "#49C280",
    fontColor: "#FFFFFF",
  },
};

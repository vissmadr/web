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
  Physics,
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
    fontColor: "#EEEEEE",
  },

  [TagNames.Input]: {
    label: "Input",
    color: "#11A011",
    fontColor: "#EEEEEE",
  },

  [TagNames.GPU]: {
    label: "GPU",
    color: "#DD1111",
    fontColor: "#EEEEEE",
  },

  [TagNames.Noise]: {
    label: "Noise",
    color: "#A08070",
    fontColor: "#EEEEEE",
  },

  [TagNames.Education]: {
    label: "Education",
    color: "#127FDE",
    fontColor: "#EEEEEE",
  },

  [TagNames.Particles]: {
    label: "Particles",
    color: "#FF8010",
    fontColor: "#EEEEEE",
  },

  [TagNames.Image]: {
    label: "Image",
    color: "#D56065",
    fontColor: "#EEEEEE",
  },

  [TagNames.Pathfinding]: {
    label: "Pathfinding",
    color: "#2040B1",
    fontColor: "#EEEEEE",
  },

  [TagNames.Collision]: {
    label: "Collision",
    color: "#9163F2",
    fontColor: "#EEEEEE",
  },

  [TagNames.Random]: {
    label: "Random",
    color: "#6E915F",
    fontColor: "#EEEEEE",
  },

  [TagNames.ASCII]: {
    label: "ASCII",
    color: "#666666",
    fontColor: "#EEEEEE",
  },

  [TagNames.Automata]: {
    label: "Automata",
    color: "#AA11AA",
    fontColor: "#EEEEEE",
  },

  [TagNames.Bright]: {
    label: "Bright",
    color: "#DDDDDD",
    fontColor: "#111111",
  },

  [TagNames.Physics]: {
    label: "Physics",
    color: "#49C280",
    fontColor: "#EEEEEE",
  },
};

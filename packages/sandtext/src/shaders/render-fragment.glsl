#version 300 es
precision highp float;

in float passRandom;
in float inputDistanceSquared;

out vec4 outColor;

const vec4 COLOR1 = vec4(1.0, 0.1, 0.0, 1.0);
const vec4 COLOR2 = vec4(1.0, 0.3, 0.0, 1.0);
const vec4 COLOR3 = vec4(1.0, 0.5, 0.0, 1.0);
const vec4 COLOR4 = vec4(1.0, 0.7, 0.0, 1.0);
const vec4 COLOR5 = vec4(1.0, 0.9, 0.0, 1.0);

void main() {
  if      (passRandom < 0.30)  outColor = COLOR1;
  else if (passRandom < 0.45)  outColor = COLOR2;
  else if (passRandom < 0.70)  outColor = COLOR3;
  else if (passRandom < 0.85)  outColor = COLOR4;
  else                         outColor = COLOR5;
}

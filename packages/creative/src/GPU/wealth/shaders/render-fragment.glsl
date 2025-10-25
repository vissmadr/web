#version 300 es
precision highp float;

in float passRandom;

out vec4 outColor;

const vec4 COLOR1 = vec4(1.0, 0.4, 0.0, 1.0);
const vec4 COLOR2 = vec4(1.0, 0.6, 0.0, 1.0);
const vec4 COLOR3 = vec4(1.0, 0.8, 0.0, 1.0);
const vec4 COLOR4 = vec4(1.0, 1.0, 0.5, 1.0);

void main() {
  if      (passRandom < 0.36) outColor = COLOR1;
  else if (passRandom < 0.70) outColor = COLOR2;
  else if (passRandom < 0.97) outColor = COLOR3;
  else                        outColor = COLOR4;
}

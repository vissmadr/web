out vec2 tf_position;

in vec2 a_position;
in vec2 a_textOrigin;
in float a_random;

uniform float u_time;
uniform float u_noiseFrequency;
uniform vec2 u_returnSpeed;
uniform vec2 u_noiseScalar;

const vec2 ZERO = vec2(0.0);
const float MIN = 0.00000000001;

vec2 getReturnVelocity() {
  vec2 difference = a_textOrigin - a_position;

  float magnitudeSquared = difference.x * difference.x + difference.y * difference.y;
  if(magnitudeSquared <= MIN)
    return ZERO;

  float magnitude = sqrt(magnitudeSquared);

  vec2 direction = difference / magnitude;

  float speed = mix(u_returnSpeed.r, u_returnSpeed.g, a_random);
  float returnSpeed = magnitude * speed;

  return direction * returnSpeed;
}

void main() {
  vec2 velocity = ZERO;

  float noise = getNoise(a_position * u_noiseFrequency + u_time + a_random) * 2.0 - 1.0;
  noise *= mix(u_noiseScalar.r, u_noiseScalar.g, noise);

  velocity += getReturnVelocity();
  velocity += noise;

  tf_position = a_position + velocity;
}

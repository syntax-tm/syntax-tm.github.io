export const konamiCodeShaderSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  // pixel grid sizing: adjust this number to change pixel size
  float pixelSize = 48.0; // 8.0

  // quantize coordinates to create the pixelated effect
  vec2 uv = floor(gl_FragCoord.xy / pixelSize) * pixelSize / u_resolution.xy;

  // create an example retro procedural animation pattern
  float colorA = sin(uv.x * 4.0 + u_time) * 0.5 + 0.5;
  float colorB = cos(uv.y * 4.0 - u_time) * 0.5 + 0.5;

  gl_FragColor = vec4(colorA, colorB, 0.8, 1.0);
}
`;
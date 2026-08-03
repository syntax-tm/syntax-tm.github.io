export default `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// Retro Pseudorandom Hash Function
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // 1. Define gameboy/retro-esque MissingNo. hex colors
  vec4 colorWhite = vec4(0.93, 0.93, 0.88, 0.5);
  vec4 colorLight = vec4(0.68, 0.65, 0.70, 0.5); // Iconic light purple/gray
  vec4 colorDark  = vec4(0.40, 0.38, 0.35, 0.5); // Fawn / dark gray
  vec4 colorBlack = vec4(0.08, 0.08, 0.10, 0.5);

  // 2. Set pixel sizes to look like a raw Game Boy VRAM dump
  // MissingNo blocks are wider horizontally than they are tall!
  vec2 blockDimensions = vec2(64.0, 24.0);  //vec2(32.0, 12.0);

  // Get base pixel coordinates
  vec2 blockCoord = floor(gl_FragCoord.xy / blockDimensions);

  // 3. Inject horizontal shifting to simulate data misalignment
  // Every horizontal row shifts left or right based on time and row hash
  float shiftTime = floor(u_time * 2.0); // 8.0 Steps smoothly like 8-bit frames
  float rowShift = floor(rand(vec2(blockCoord.y, shiftTime)) * 12.0) - 6.0;
  blockCoord.x += rowShift;

  // 4. Generate the glitch sequence hash value
  float noiseValue = rand(blockCoord);

  // 5. Build an abstract shape bounding system
  // MissingNo looks like a rough 'reversed L' block shape
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // Generate random empty transparent holes to break the background up
  float maskingNoise = rand(floor(gl_FragCoord.xy / vec2(64.0, 64.0)) + shiftTime);
  if (maskingNoise > 0.82) {
    discard; // Erases sections dynamically to replicate broken sprite data
  }

  // 6. Map the raw float noise cleanly to the 4 discrete colors
  vec4 finalColor;
  if (noiseValue < 0.25) {
    finalColor = colorBlack;
  } else if (noiseValue < 0.50) {
    finalColor = colorDark;
  } else if (noiseValue < 0.75) {
    finalColor = colorLight;
  } else {
    finalColor = colorWhite;
  }

  gl_FragColor = finalColor;
}
`;
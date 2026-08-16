export const androidShaderSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// retro 8-bit pseudorandom hash
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // 1. dynamic pixel block scale modulation
  // pixel block size waves smoothly between 2.0 (crisper) and 12.0 (ultra-blocky retro)
  float timeScaleFactor = u_time * 0.15;
  float pixelSize = 7.0 + sin(timeScaleFactor) * 5.0;

  // apply downscaled coordinate snapping
  vec2 pixelCoord = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
  vec2 uv = pixelCoord / u_resolution.xy;
  vec2 centeredUV = (pixelCoord - 0.5 * u_resolution.xy) / u_resolution.y;

  // 2. slow time stepping (choppy ~15 fps render loop look)
  float steppedTime = floor((u_time * 0.4) * 30.0) * (1.0 / 30.0);

  // 3. floating lava blob simulation via metaballs (8 blobs)
  float totalInfluence = 0.0;
  totalInfluence += 0.18 / (centeredUV.y + 0.65); // bottom fluid tank
  totalInfluence += 0.08 / (0.65 - centeredUV.y); // top fluid tank

  for (int i = 1; i <= 8; i++) {
    float index = float(i);
    float blobX = sin(steppedTime * (0.3 + index * 0.08) + index * 2.2) * 0.30;
    float blobY = cos(steppedTime * (0.15 + index * 0.04) + index * 4.1) * 0.50;
    float radius = 0.05 + sin(steppedTime * 0.5 + index) * 0.015;

    vec2 blobCenter = vec2(blobX, blobY);
    float dist = length(centeredUV - blobCenter);
    totalInfluence += (radius * radius) / (dist * dist);
  }

  // 4. color swapping spectrum rotation logic
  // subtle cyclical offsets to shift palette colors globally over time
  float colorCycle = u_time * 0.08;

  vec3 glassliquid  = vec3(0.04, 0.05, 0.08); // fixed base fluid container color

  // base vibrant cyber colors transformed continuously via sine offsets
  vec3 androidGreen = vec3(0.24, 0.73, 0.42) + sin(colorCycle) * 0.15;
  vec3 electricCyan = vec3(0.15, 0.65, 0.85) + cos(colorCycle * 1.2) * 0.15;
  vec3 hotMagenta   = vec3(0.85, 0.15, 0.55) + sin(colorCycle * 0.8) * 0.20;
  vec3 neonYellow   = vec3(0.88, 0.85, 0.20) + cos(colorCycle * 1.5) * 0.10;
  vec3 digitalWhite = vec3(0.95, 0.98, 0.95); // fixed highlight core

  vec3 finalColor = glassLiquid;

  if (totalInfluence > 2.8) {
    finalColor = digitalWhite;
  } else if (totalInfluence > 1.6) {
    finalColor = neonYellow;
  } else if (totalInfluence > 0.9) {
    finalColor = hotMagenta;
  } else if (totalInfluence > 0.5) {
    finalColor = electricCyan;
  } else if (totalInfluence > 0.3) {
    finalColor = androidGreen;
  }

  // 6. ps1 4x4 ordered bayer matrix dithering (adapts cleanly to dynamic resolutions)
  float ditherPatternX = mod(pixelCoord.x / pixelSize, 4.0);
  float ditherPatternY = mod(pixelCoord.y / pixelSize, 4.0);
  float ditherThreshold = 0.0;

  if (ditherPatternY == 0.0) {
    if (ditherPatternX == 0.0) ditherThreshold = 0.0000;
    if (ditherPatternX == 1.0) ditherThreshold = 0.5000;
    if (ditherPatternX == 2.0) ditherThreshold = 0.1250;
    if (ditherPatternX == 3.0) ditherThreshold = 0.6250;
  } else if (ditherPatternY == 1.0) {
    if (ditherPatternX == 0.0) ditherThreshold = 0.7500;
    if (ditherPatternX == 1.0) ditherThreshold = 0.2500;
    if (ditherPatternX == 2.0) ditherThreshold = 0.8750;
    if (ditherPatternX == 3.0) ditherThreshold = 0.3750;
  } else if (ditherPatternY == 2.0) {
    if (ditherPatternX == 0.0) ditherThreshold = 0.1875;
    if (ditherPatternX == 1.0) ditherThreshold = 0.6875;
    if (ditherPatternX == 2.0) ditherThreshold = 0.0625;
    if (ditherPatternX == 3.0) ditherThreshold = 0.5625;
  } else if (ditherPatternY == 3.0) {
    if (ditherPatternX == 0.0) ditherThreshold = 0.9375;
    if (ditherPatternX == 1.0) ditherThreshold = 0.4375;
    if (ditherPatternX == 2.0) ditherThreshold = 0.8125;
    if (ditherPatternX == 3.0) ditherThreshold = 0.3125;
  }

  // heavy cross-hatch retro texture blending
  finalColor += (ditherThreshold - 0.5) * 0.16;
  finalColor = floor(finalColor * 5.0) / 5.0; // hard clamp color depth bits

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

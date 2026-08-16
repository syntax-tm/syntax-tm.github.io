export const silentHillShaderSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// retro pseudorandom hash function
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// 2D noise for organic, rolling fog layers
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = rand(i);
  float b = rand(i + vec2(1.0, 0.0));
  float c = rand(i + vec2(0.0, 1.0));
  float d = rand(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  // 1. core ps1 silent hill color palette (industrial, grime-tinted grays)
  vec3 fogDark  = vec3(0.18, 0.18, 0.19); // deep, oppressive background fog
  vec3 fogLight = vec3(0.42, 0.41, 0.40); // ash-choked daylight sky fog
  vec3 ashColor = vec3(0.55, 0.55, 0.53); // drifting burnt flakes

  // 2. pixelation grid
  float pixelSize = 4.0;
  vec2 pixelCoord = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
  vec2 uv = pixelCoord / u_resolution.xy;

  // 3. procedural fog simulation (layered rolling noise)
  vec2 fogUV = uv * 3.0;
  fogUV.y -= u_time * 0.05; // slow upward/forward drifting motion
  fogUV.x += sin(u_time * 0.1 + uv.y) * 0.2; // eerie swaying swing

  float fogDensity = noise(fogUV) * 0.6 + noise(fogUV * 2.5 + u_time * 0.02) * 0.4;
  vec3 finalFog = mix(fogDark, fogLight, fogDensity);

  // 4. ps1 ordering dither matrix simulation (4x4 retro posterization grid)
  float ditherPattern = mod(pixelCoord.x / pixelSize, 4.0);
  float ditherPatternY = mod(pixelCoord.y / pixelSize, 4.0);
  float ditherThreshold = (ditherPattern * 4.0 + ditherPatternY) / 16.0;

  // crunch the fog colors into dithered gradients
  finalFog += (ditherThreshold - 0.5) * 0.07;
  finalFog = floor(finalFog * 8.0) / 8.0; // hard clamp to 15-bit color space emulation

  // 5. slowly falling ash layer
  vec2 ashUV = pixelCoord;
  ashUV.y += u_time * 45.0; // drifts downwards continuously
  ashUV.x += sin(u_time * 0.5 + pixelCoord.y * 0.02) * 15.0; // sideways wind swaying

  // slice screen into tiny discrete particle cell structures
  vec2 ashGrid = floor(ashUV / 16.0);
  float ashSpawnHash = rand(ashGrid);

  float ashParticle = 0.0;
  // generate individual falling flakes based on threshold matching
  if (ashSpawnHash > 0.96) {
    vec2 centerOffset = fract(ashUV / 16.0) - 0.5;
    // keep flakes sharp and blocky instead of circular
    if (abs(centerOffset.x) < 0.2 && abs(centerOffset.y) < 0.2) {
      ashParticle = 1.0;
    }
  }

  // 6. blend ash over fog
  vec3 finalColor = mix(finalFog, ashColor, ashParticle * 0.7);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

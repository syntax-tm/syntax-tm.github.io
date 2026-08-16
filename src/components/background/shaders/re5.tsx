export const re5ShaderSource = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

// high-fidelity pseudorandom hash generator
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2d smooth gradient noise for fluid heat waves and viral growth
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep interpolation

  return mix(mix(rand(i + vec2(0.0,0.0)), rand(i + vec2(1.0,0.0)), u.x),
             mix(rand(i + vec2(0.0,1.0)), rand(i + vec2(1.0,1.0)), u.x), u.y);
}

// fractional brownian motion (fbm) for realistic, layered organic structures
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(st);
    st *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  // 1. re5 high-contrast color palette (aggressive green-gold / sepia wash)
  vec3 sunScorchedDirt = vec3(0.58, 0.52, 0.38); // blinding, dusty desert gold
  vec3 militaryOlive   = vec3(0.24, 0.28, 0.20); // vross-process green shadows
  vec3 uroborosBase    = vec3(0.02, 0.02, 0.03); // pure black organic oil virus
  vec3 pustuleGlow     = vec3(0.85, 0.45, 0.05); // pulsing orange viral weak points

  // normalize screen coordinates
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 centeredUV = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

  // 2. blinding desert heat shimmer (uv coordinate warp)
  // simulates the mirage distortion of the sun baking the canvas
  vec2 heatWarpUV = uv;
  heatWarpUV.x += sin(uv.y * 20.0 + u_time * 2.5) * 0.003;
  heatWarpUV.y += cos(uv.x * 15.0 + u_time * 2.0) * 0.002;

  // 3. iconic cross-processed color grading engine
  // generates a harsh background representing the sun-bleached slums of kijuju
  float vignette = smoothstep(1.3, 0.4, length(centeredUV));
  float backgroundPattern = noise(heatWarpUV * 3.0 + vec2(0.0, u_time * 0.01));
  
  // blend dirt gold with oppressive military olive green using the vignette
  vec3 bakedBackground = mix(militaryOlive, sunScorchedDirt, backgroundPattern);
  bakedBackground *= vignette; // Darken edges heavily for cinematic weight

  // 4. uroboros virus mutation layer (creeping black oil tendrils)
  // simulates the dynamic, writhing black leech-mass spreading across the screen
  vec2 virusUV = centeredUV * 1.8;
  
  // distort virus tracking mapping dynamically to simulate living movement
  virusUV.x += fbm(virusUV + vec2(u_time * 0.1, 0.0)) * 0.2;
  virusUV.y += fbm(virusUV - vec2(0.0, u_time * 0.08)) * 0.2;

  float virusStructure = fbm(virusUV);
  
  // animate the size threshold smoothly over time to make the virus breathe
  float virusGrowthThreshold = 0.48 + sin(u_time * 0.3) * 0.04;
  float virusMask = smoothstep(virusGrowthThreshold + 0.03, virusGrowthThreshold - 0.03, virusStructure);

  // 5. pulsing viral core pustules (uroboros weak points)
  float coreMask = 0.0;
  float coreGlowIntensity = 0.0;

  if (virusMask > 0.1) {
    // isolate cells inside the virus tendrils to plant hot orange weak points
    vec2 cellUV = virusUV * 4.0;
    float cellNoise = noise(floor(cellUV) + floor(u_time * 0.5));
    
    if (cellNoise > 0.72) {
      vec2 cellCenter = fract(cellUV) - 0.5;
      float distToCore = length(cellCenter);
      
      // smoothly shape the glowing sphere cores
      coreMask = smoothstep(0.35, 0.0, distToCore) * virusMask;
      
      // rhythmic organic pulsing light algorithm
      coreGlowIntensity = sin(u_time * 4.0 + cellNoise * 10.0) * 0.5 + 0.5;
    }
  }

  // 6. cinematic multi-layer compositing
  vec3 finalColor = bakedBackground;

  if (virusMask > 0.0) {
    // shade the writhing black oil with a glossy, wet rim highlight
    float specularRim = smoothstep(0.3, 0.0, abs(virusStructure - virusGrowthThreshold));
    vec3 shadedVirus = mix(uroborosBase, vec3(0.15, 0.18, 0.15), specularRim * 0.4);
    
    finalColor = mix(finalColor, shadedVirus, virusMask);
  }

  if (coreMask > 0.0) {
    // layer the glowing orange biological weak points on top of the black virus
    vec3 dynamicCoreColor = mix(pustuleGlow, vec3(1.0, 0.9, 0.6), coreGlowIntensity * 0.4);
    finalColor = mix(finalColor, dynamicCoreColor, coreMask);
  }

  // final color wash correction step
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const iwhbydShaderSource = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// High-fidelity pseudorandom hash generator
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D Smooth Gradient Noise for volumetric energy fields
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f * f * (3.0 - 2.0 * f); // Smoothstep interpolation

  return mix(mix(rand(i + vec2(0.0,0.0)), rand(i + vec2(1.0,0.0)), u.x),
             mix(rand(i + vec2(0.0,1.0)), rand(i + vec2(1.0,1.0)), u.x), u.y);
}

// Procedural Hexagonal Grid Generator (Covenant Shield Array)
vec2 hexCoord(vec2 uv) {
  vec2 r = vec2(1.0, 1.7320508); // Hex aspect ratio constants
  vec2 h = r * 0.5;
  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv - h, r) - h;
  return dot(a, a) < dot(b, b) ? a : b;
}

void main() {
  // 1. Halo 3 Sci-Fi Color Palette
  vec3 arkSkyVoid     = vec3(0.02, 0.04, 0.09); // Deep cosmic blue skybox
  vec3 forerunnerMetal = vec3(0.18, 0.20, 0.22); // Cold, brushed Forerunner alloy
  vec3 hardlightBlue  = vec3(0.25, 0.65, 0.95); // Iconic Forerunner energy beam / plasma blue
  vec3 shieldGold     = vec3(0.95, 0.60, 0.15); // Master Chief shield flare / Covenant orange

  // Normalize screen coordinates
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 centeredUV = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  vec2 normalizedMouse = (u_mouse - 0.5 * u_resolution.xy) / u_resolution.y;

  // 2. Cosmic Background: The Maw of The Ark
  // Renders a sweeping galactic mist representing the artificial horizon of Installation 00
  float vignette = smoothstep(1.4, 0.5, length(centeredUV));
  float cloudLayer = noise(centeredUV * 2.0 + vec2(u_time * 0.03, 0.0));
  vec3 backgroundSky = mix(arkSkyVoid, hardlightBlue * 0.25, cloudLayer) * vignette;

  // 3. Forerunner Architecture Layer (Geometric Structural Panels)
  // Generates sharp, linear angles mimicking the monolith structures of "The Silent Cartographer"
  float structuralLine = smoothstep(0.01, 0.0, abs(centeredUV.x - 0.3) - 0.005);
  structuralLine += smoothstep(0.01, 0.0, abs(centeredUV.y + centeredUV.x * 0.5) - 0.008);
  
  vec3 metalStructure = forerunnerMetal * (noise(centeredUV * 15.0) * 0.3 + 0.7);

  // 4. Glowing Forerunner Circuit Pathways
  // Animates pulses of blue hardlight shooting down the geometric tracks
  float circuitPulse = smoothstep(0.4, 0.0, abs(sin(centeredUV.y * 3.0 - u_time * 1.5)));
  float circuitMask = structuralLine * circuitPulse;

  // 5. Elite/Master Chief Shield Hexagonal Lattice Interaction
  // Recreates the transparent energy mesh that flares up near the cursor position
  float distanceToMouse = length(centeredUV - normalizedMouse);
  
  // The shield ripple flares brightly right at the mouse tip and fades outward
  float shieldIntensity = smoothstep(0.35, 0.0, distanceToMouse);
  
  // Scale coordinate mapping for a tight hexagonal grid matrix
  vec2 hexUV = hexCoord(centeredUV * 28.0);
  float hexEdges = smoothstep(0.02, 0.05, abs(length(hexUV) - 0.45));
  
  // Hex shield element mask layered with a constant breathing animation
  float shieldMask = hexEdges * shieldIntensity * (0.6 + sin(u_time * 3.0) * 0.2);

  // 6. Modern Cinematic Compositing
  // Start with the massive cosmic sky background
  vec3 finalColor = backgroundSky;

  // Layer the massive matte metal Forerunner panels on top based on an edge threshold
  float panelMask = smoothstep(-0.2, 0.4, centeredUV.y + centeredUV.x * 0.3);
  finalColor = mix(finalColor, metalStructure, panelMask * 0.85);

  // Composite the glowing Forerunner hardlight channels
  if (circuitMask > 0.01) {
    finalColor = mix(finalColor, hardlightBlue * 1.5, circuitMask);
  }

  // Overlay the hexagonal energy shield shield grid that reactively burns gold over the entire canvas
  if (shieldMask > 0.01) {
    // Dynamic color shifting from deep orange into bright flare yellow based on intensity
    vec3 hotShieldColor = mix(shieldGold, vec3(1.0, 0.95, 0.75), shieldIntensity);
    finalColor = mix(finalColor, hotShieldColor, shieldMask * 0.75);
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
`;
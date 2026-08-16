export const dreamcastShaderSource = `
uniform vec2 u_resolution;
varying vec2 vUv;

void main() {
  // correct for aspect ratio so the radial circle stays perfectly round
  vec2 aspectUv = vUv;
  if (u_resolution.x > u_resolution.y) {
      aspectUv.y = (vUv.y - 0.5) * (u_resolution.y / u_resolution.x) + 0.5;
  } else {
      aspectUv.x = (vUv.x - 0.5) * (u_resolution.x / u_resolution.y) + 0.5;
  }

  // --- LAYER 1: LINEAR GRADIENT ---
  // css: linear-gradient(#bfe3ff 0%, #87afe4 55%, #5178c8 100%)
  // note: css linear gradients go top-to-bottom, so we map vuv.y accordingly
  vec3 color1 = vec3(0.749, 0.890, 1.000); // #bfe3ff
  vec3 color2 = vec3(0.529, 0.686, 0.894); // #87afe4
  vec3 color3 = vec3(0.318, 0.471, 0.784); // #5178c8

  vec3 linearColor;
  if (vUv.y > 0.45) {
      // top half transition (from 55% to 100% in glsl's bottom-up y space)
      float t = (vUv.y - 0.45) / 0.55;
      linearColor = mix(color2, color1, smoothstep(0.0, 1.0, t));
  } else {
      // Bottom half transition (from 0% to 55% in GLSL's bottom-up Y space)
      float t = vUv.y / 0.45;
      linearColor = mix(color3, color2, smoothstep(0.0, 1.0, t));
  }

  // --- LAYER 2: RADIAL GRADIENT ---
  // css: radial-gradient(circle at 50% 75%, rgba(255,255,255,.55), transparent 30%)
  // center is at x=50%, y=75% (css reads top-down, so 75% from top is 25% from bottom in glsl y)
  vec2 radialCenter = vec2(0.5, 0.25);

  // calculate distance from center using aspect-corrected UVs
  float dist = distance(aspectUv, radialCenter);

  // the CSS gradient ends cleanly at 30% radius (0.3)
  float radialMask = 1.0 - smoothstep(0.0, 0.3, dist);

  // apply the 0.55 maximum opacity from the CSS rgba value
  vec4 radialColor = vec4(vec3(1.0), radialMask * 0.55);

  // --- BLEND THE LAYERS ---
  // normal alpha compositing: Blend the radial white layer over the linear base
  vec3 finalColor = mix(linearColor, radialColor.rgb, radialColor.a);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

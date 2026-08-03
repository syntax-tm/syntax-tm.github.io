export default `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// High-fidelity pseudorandom hash generator
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Helper to draw clean anti-aliased mathematical circles
float drawCircle(vec2 center, float radius, float thickness, vec2 uv) {
  float dist = length(uv - center);
  return smoothstep(thickness, 0.0, abs(dist - radius));
}

// Helper to draw solid geometric disks
float drawDisk(vec2 center, float radius, vec2 uv) {
  return smoothstep(radius, radius - 0.003, length(uv - center));
}

// Helper to draw clean vector lines between points
float drawLine(vec2 p1, vec2 p2, vec2 uv, float thickness) {
  vec2 g = p2 - p1;
  vec2 d = uv - p1;
  float t = clamp(dot(d, g) / dot(g, g), 0.0, 1.0);
  float dist = length(d - g * t);
  return smoothstep(thickness, thickness - 0.002, dist);
}

// 2D Rotation Matrix helper for the spiral animation
vec2 rotate2D(vec2 uv, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
}

void main() {
  // 1. Authentic Sega Dreamcast Color Palette
  vec3 dreamcastWhite = vec3(0.92, 0.93, 0.95); // Bright, clean matte white console shell
  vec3 menuGray       = vec3(0.74, 0.76, 0.80); // Light steel gray accents
  vec3 dcOrange       = vec3(0.98, 0.38, 0.08); // The iconic swirl orange/pink gradient
  vec3 selectionBlue  = vec3(0.12, 0.45, 0.74); // Vibrant VMU / button interaction blue
  vec3 fontDark       = vec3(0.25, 0.27, 0.30); // Clean charcoal for menu wireframes

  // Normalize viewport coordinates
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 centeredUV = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  vec2 normalizedMouse = (u_mouse - 0.5 * u_resolution.xy) / u_resolution.y;

  // ==========================================
  // BACKGROUND: Dynamic Dreamcast Grid & Spiral
  // ==========================================
  // Draw the soft background cross-hatch grid pattern typical of the console bios
  vec3 backgroundColor = dreamcastWhite;
  float gridLines = step(0.98, fract(centeredUV.x * 6.0)) + step(0.98, fract(centeredUV.y * 6.0));
  backgroundColor = mix(backgroundColor, menuGray * 0.4 + dreamcastWhite * 0.6, gridLines * 0.4);

  // Render the iconic floating backdrop Dreamcast spiral logo
  // Offset the coordinate field safely to center it beautifully in the upper left background quadrant
  vec2 spiralUV = centeredUV - vec2(-0.45, 0.22);
  spiralUV = rotate2D(spiralUV, u_time * 0.25); // Slow, soothing rotation physics
  
  float r = length(spiralUV);
  float theta = atan(spiralUV.y, spiralUV.x);
  
  // Archimedean Spiral function: r = a + b * theta
  // Use sin curves over the radius distance to turn it into a thick looping line band
  float spiralForm = sin(5.0 * r - theta + u_time * 0.5);
  float spiralMask = smoothstep(0.7, 0.9, spiralForm) * smoothstep(0.35, 0.08, r);
  
  // Layer spiral softly into background matrix
  backgroundColor = mix(backgroundColor, dcOrange, spiralMask * 0.18);

  // ==========================================
  // MENU SYSTEM: 4-Way Compass Navigation Node Arrays
  // ==========================================
  float vectorUI = 0.0;
  float selectionHighlight = 0.0;

  // Define positions for the four core quadrants: Play, File, Music, Settings
  vec2 posPlay     = vec2(0.0,  0.22);
  vec2 posFile     = vec2(-0.35, 0.0);
  vec2 posMusic    = vec2(0.35,  0.0);
  vec2 posSettings = vec2(0.0, -0.22);

  // Draw linking intersection vector geometry lines connecting the main nodes
  vectorUI += drawLine(posPlay, posSettings, centeredUV, 0.0015);
  vectorUI += drawLine(posFile, posMusic, centeredUV, 0.0015);

  // Interaction tracking logic: Find closest menu button relative to user cursor
  float dPlay     = length(centeredUV - posPlay);
  float dFile     = length(centeredUV - posFile);
  float dMusic    = length(centeredUV - posMusic);
  float dSettings = length(centeredUV - posSettings);

  // Handle Play Node (Top)
  vectorUI += drawCircle(posPlay, 0.07, 0.003, centeredUV);
  if (dPlay < 0.07) selectionHighlight += drawDisk(posPlay, 0.065, centeredUV) * 1.0;
  // Inner Triangle vector icon inside Play button
  vec2 playTri = centeredUV - posPlay;
  if (playTri.x > -0.015 && playTri.x < 0.02 && abs(playTri.y) < (0.025 - playTri.x * 0.5)) {
    vectorUI += 1.0;
  }

  // Handle File Node (Left)
  vectorUI += drawCircle(posFile, 0.07, 0.003, centeredUV);
  if (dFile < 0.07) selectionHighlight += drawDisk(posFile, 0.065, centeredUV) * 2.0;
  // Visual Memory Unit (VMU) square icon representation inside File button
  vec2 fileBox = abs(centeredUV - posFile);
  if (fileBox.x < 0.025 && fileBox.y < 0.035) {
    float vmuBorder = smoothstep(0.022, 0.025, fileBox.x) + smoothstep(0.032, 0.035, fileBox.y);
    float vmuScreen = step(fileBox.x, 0.015) * step(abs(centeredUV.y - (posFile.y + 0.012)), 0.01);
    vectorUI += clamp(vmuBorder + vmuScreen, 0.0, 1.0);
  }

  // Handle Music Node (Right)
  vectorUI += drawCircle(posMusic, 0.07, 0.003, centeredUV);
  if (dMusic < 0.07) selectionHighlight += drawDisk(posMusic, 0.065, centeredUV) * 3.0;
  // Audio CD ring graphics inside Music button
  vectorUI += drawCircle(posMusic, 0.03, 0.002, centeredUV);
  vectorUI += drawCircle(posMusic, 0.01, 0.002, centeredUV);

  // Handle Settings Node (Bottom)
  vectorUI += drawCircle(posSettings, 0.07, 0.003, centeredUV);
  if (dSettings < 0.07) selectionHighlight += drawDisk(posSettings, 0.065, centeredUV) * 4.0;
  // Wrench/Clock tool silhouette representation inside Settings button
  vec2 setTool = abs(centeredUV - posSettings);
  vectorUI += drawCircle(posSettings, 0.025, 0.003, centeredUV);
  if (setTool.x < 0.005 && centeredUV.y - posSettings.y < -0.01 && centeredUV.y - posSettings.y > -0.04) {
    vectorUI += 1.0;
  }

  // ==========================================
  // PERIPHERALS: Retro Corner Clock Panel
  // ==========================================
  // Render the minimalist clock and date outline panel on the bottom right margin
  vec2 clockPanelUV = centeredUV - vec2(0.52, -0.40);
  if (abs(clockPanelUV.x) < 0.16 && abs(clockPanelUV.y) < 0.04) {
    float panelBorder = smoothstep(0.038, 0.04, abs(clockPanelUV.y)) + smoothstep(0.158, 0.16, abs(clockPanelUV.x));
    vectorUI += clamp(panelBorder, 0.0, 1.0);
    
    // Simulate real-time digital clock numbers pulsing divider colon dots
    float clockColon = drawDisk(vec2(0.0, 0.01), 0.004, clockPanelUV) + drawDisk(vec2(0.0, -0.01), 0.004, clockPanelUV);
    vectorUI += clockColon * step(0.4, sin(u_time * 3.1415));
  }

  // ==========================================
  // HIGH-RESOLUTION CINEMATIC COMPOSITING
  // ==========================================
  vec3 finalColor = backgroundColor;

  // Mix standard wireframes and icons onto the layout field
  if (vectorUI > 0.01) {
    finalColor = mix(finalColor, fontDark, clamp(vectorUI, 0.0, 1.0));
  }

  // Color map the active button hover triggers to selection blue
  if (selectionHighlight > 0.01) {
    finalColor = mix(finalColor, selectionBlue, 0.85);
    // Draw the white inner vector shapes cleanly over the highlighted buttons
    if (vectorUI > 0.01) {
      finalColor = dreamcastWhite;
    }
  }

  // Subtle ambient overlay to give the clean white a soft 1999 glossy plastic CRT CRT feel
  float shine = smoothstep(-0.5, 0.5, centeredUV.y + centeredUV.x * 0.2) * 0.04;
  finalColor += vec3(shine);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

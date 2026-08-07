export const oceangateShaderSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// Pseudo-random function for generating floating particles
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
    float pixelSize = 6.0; // Control pixel clump size

    // 1. Quantize screen space coordinates
    vec2 pixelCoord = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
    vec2 uv = pixelCoord / u_resolution;

    // 2. Very dark abyss blue background gradient
    vec3 deepAbyss = vec3(0.005, 0.01, 0.06); // Near black-blue
    vec3 midOcean  = vec3(0.01, 0.04, 0.12);  // Muted dark teal-blue
    vec3 finalColor = mix(deepAbyss, midOcean, uv.y);

    // Apply global water wave distortion to all visual elements
    float waterWave = sin(uv.y * 8.0 + u_time * 1.5) * 0.015;
    vec2 distortedUV = uv + vec2(waterWave, 0.0);

    // 3. Draw Seaweed Bed (Multiple stems layered together)
    float seaweedLayer = 0.0;

    // Loop to draw 4 distinct pixelated seaweed stalks
    for(int i = 1; i <= 4; i++) {
        float fi = float(i);

        // Define unique X-positions and heights for each plant
        float xOffset = 0.15 * fi + 0.1;
        float maxHeight = 0.35 + 0.12 * sin(fi * 45.3);

        // Sway math: Make seaweed sway side-to-side based on its vertical position
        float sway = sin(distortedUV.y * 6.0 - (u_time * 1.2) + fi) * (0.04 * distortedUV.y);

        // Base width of the stalk tapering as it grows upward
        float width = (0.025 - (distortedUV.y * 0.03)) * (1.0 + 0.2 * cos(distortedUV.y * 40.0));

        // Check if current fragment pixel falls inside the stalk limits
        if (distortedUV.y < maxHeight) {
            float distanceToCenter = abs(distortedUV.x - (xOffset + sway));
            if (distanceToCenter < width) {
                // Closer stalks are lighter, deeper background stalks are darker
                seaweedLayer = 0.3 + (fi * 0.15);
            }
        }
    }

    // Blend seaweed into the scene (Muted deep sea organic greens)
    vec3 seaweedColor = vec3(0.02, 0.22, 0.14);
    if(seaweedLayer > 0.0) {
        finalColor = mix(finalColor, seaweedColor * seaweedLayer, 0.85);
    }

    // 4. Floating Plankton / Bubble Particles
    // Create a repeating grid system to check for procedural dots
    vec2 particleGrid = floor(distortedUV * vec2(25.0, 15.0));

    // Shift particle rows vertically over time to simulate floating upwards
    particleGrid.y = floor((distortedUV.y - u_time * 0.05) * 15.0);

    // Generate a unique identifier hash for each grid cell
    float particleID = hash(particleGrid);

    // Only spawn particles in cells that clear a high random threshold
    if(particleID > 0.94) {
        // Local center point math inside the active grid tile
        vec2 localUV = fract(distortedUV * vec2(25.0, 15.0) - vec2(0.0, u_time * 0.75));
        float distToBubble = length(localUV - vec2(0.5));

        // Render small pixelated bubble points
        if(distToBubble < 0.18) {
            vec3 bubbleTeal = vec3(0.1, 0.5, 0.5);
            finalColor += bubbleTeal * (1.0 - distToBubble);
        }
    }

    // 5. Ambient Abyss Vignette (Darkens the frame edges)
    vec2 vignetteUV = gl_FragCoord.xy / u_resolution;
    vignetteUV *=  1.0 - vignetteUV.yx;
    float vignette = vignetteUV.x * vignetteUV.y * 15.0;
    vignette = clamp(pow(vignette, 0.4), 0.0, 1.0);
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

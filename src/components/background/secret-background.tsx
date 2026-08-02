'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSecret } from '@context/SecretContext';
import "./secret-background.css";

type bgShaderKind = "silent-hill" | "konami-code" | "missing-no" | "oceangate" | "android";

export default function SecretBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<WebGLRenderingContext | null>(null);
  const shaderProgramRef = useRef<WebGLProgram | null>(null);
  const positionLocationRef = useRef<number | null>(null);
  const timeUniformLocationRef = useRef<WebGLUniformLocation | null>(null);
  const resolutionUniformLocationRef = useRef<WebGLUniformLocation | null>(null);
  const positionBufferRef = useRef<WebGLBuffer | null>(null);
  const frameRef = useRef<number | null>(null);
  const { isMissingNoSecretActive, is404SecretActive, isKonamiSecretActive, isOceangateSecretActive, isAndroidSecretActive } = useSecret();
  const [fsSource, setFsSource] = useState<string | null>(null);
  const [kind, setKind] = useState<bgShaderKind | null>(null);

  // 2. Define Vertex Shader (Draws a full-screen quad)
  const vsSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

  // 3. Define Fragment Shader (Generates pixelated procedural waves)
  const defaultfsSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  // Pixel grid sizing: Adjust this number to change pixel size
  float pixelSize = 12.0; // 8.0

  // Quantize coordinates to create the pixelated effect
  vec2 uv = floor(gl_FragCoord.xy / pixelSize) * pixelSize / u_resolution.xy;

  // Create an example retro procedural animation pattern
  float colorA = sin(uv.x * 4.0 + u_time) * 0.5 + 0.5;
  float colorB = cos(uv.y * 4.0 - u_time) * 0.5 + 0.5;

  gl_FragColor = vec4(colorA, colorB, 0.8, 1.0);
}
`;

  const missingNofsSource = `
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
  vec2 blockDimensions = vec2(32.0, 12.0);  //vec2(32.0, 12.0);

  // Get base pixel coordinates
  vec2 blockCoord = floor(gl_FragCoord.xy / blockDimensions);

  // 3. Inject horizontal shifting to simulate data misalignment
  // Every horizontal row shifts left or right based on time and row hash
  float shiftTime = floor(u_time * 8.0); // 8.0 Steps smoothly like 8-bit frames
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
    //discard; // Erases sections dynamically to replicate broken sprite data
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

  const sh1fsSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// Retro Pseudorandom Hash Function
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// 2D Noise for organic, rolling fog layers
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
  // 1. Core PS1 Silent Hill Color Palette (Industrial, grime-tinted grays)
  vec3 fogDark  = vec3(0.18, 0.18, 0.19); // Deep, oppressive background fog
  vec3 fogLight = vec3(0.42, 0.41, 0.40); // Ash-choked daylight sky fog
  vec3 ashColor = vec3(0.55, 0.55, 0.53); // Drifting burnt flakes

  // 2. Pixelation Grid
  float pixelSize = 4.0;
  vec2 pixelCoord = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
  vec2 uv = pixelCoord / u_resolution.xy;

  // 3. Procedural Fog Simulation (Layered rolling noise)
  vec2 fogUV = uv * 3.0;
  fogUV.y -= u_time * 0.05; // Slow upward/forward drifting motion
  fogUV.x += sin(u_time * 0.1 + uv.y) * 0.2; // Eerie swaying swing
  
  float fogDensity = noise(fogUV) * 0.6 + noise(fogUV * 2.5 + u_time * 0.02) * 0.4;
  vec3 finalFog = mix(fogDark, fogLight, fogDensity);

  // 4. PS1 Ordering Dither Matrix Simulation (4x4 retro posterization grid)
  float ditherPattern = mod(pixelCoord.x / pixelSize, 4.0);
  float ditherPatternY = mod(pixelCoord.y / pixelSize, 4.0);
  float ditherThreshold = (ditherPattern * 4.0 + ditherPatternY) / 16.0;
  
  // Crunch the fog colors into dithered gradients
  finalFog += (ditherThreshold - 0.5) * 0.07;
  finalFog = floor(finalFog * 8.0) / 8.0; // Hard clamp to 15-bit color space emulation

  // 5. Slowly Falling Ash Layer
  vec2 ashUV = pixelCoord;
  ashUV.y += u_time * 45.0; // Drifts downwards continuously
  ashUV.x += sin(u_time * 0.5 + pixelCoord.y * 0.02) * 15.0; // Sideways wind swaying

  // Slice screen into tiny discrete particle cell structures
  vec2 ashGrid = floor(ashUV / 16.0); 
  float ashSpawnHash = rand(ashGrid);

  float ashParticle = 0.0;
  // Generate individual falling flakes based on threshold matching
  if (ashSpawnHash > 0.96) {
    vec2 centerOffset = fract(ashUV / 16.0) - 0.5;
    // Keep flakes sharp and blocky instead of circular
    if (abs(centerOffset.x) < 0.2 && abs(centerOffset.y) < 0.2) {
      ashParticle = 1.0;
    }
  }

  // 6. Blend Ash over Fog
  vec3 finalColor = mix(finalFog, ashColor, ashParticle * 0.7);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

  // oceangate
  const oceangatefsSource = `
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

  // android
  const androidfsSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// Retro 8-bit Pseudorandom Hash
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // 1. Android Color Palette
  vec3 androidGreen = vec3(0.24, 0.73, 0.42); // Primary background #3DDC84
  vec3 glitchVoid   = vec3(0.04, 0.05, 0.08); // Dark space color used for tearing cracks
  vec3 glitchRed    = vec3(0.90, 0.15, 0.20); // Chromatic aberration red splitting
  vec3 starWhite    = vec3(0.88, 0.92, 0.90); // Glitched white data spikes

  // 2. Pixelation Grid Constraints (PS1-style downscaling)
  float pixelSize = 4.0;
  vec2 pixelCoord = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
  vec2 uv = pixelCoord / u_resolution.xy;

  // 3. Frame-Rate Step Lock (Crucial for old hardware look)
  float glitchTime = floor(u_time * 10.0); // Changes states heavily 10 times a second

  // 4. Horizontal Scanline Tearing
  // Calculate a row-based hash to determine if this section of the screen slips sideways
  float lineNoise = rand(vec2(floor(pixelCoord.y / 16.0), glitchTime));
  float xOffset = 0.0;
  
  if (lineNoise > 0.85) {
    // Sharp, blocky horizontal displacement step
    xOffset = (rand(vec2(glitchTime, 1.2)) - 0.5) * 0.15;
  }
  
  // Apply offset to horizontal coordinate for all subsequent visual layers
  vec2 glitchedUV = vec2(fract(uv.x + xOffset), uv.y);
  vec2 modifiedPixelCoord = glitchedUV * u_resolution.xy;

  // 5. Procedural Structural Glitches (Memory blocks eating the green screen)
  float baseGlitchMask = 0.0;
  
  // Break screen into massive rectangular data blocks
  vec2 blockGrid = floor(modifiedPixelCoord / vec2(64.0, 32.0));
  float blockNoise = rand(blockGrid + glitchTime);
  
  if (blockNoise > 0.93) {
    baseGlitchMask = 1.0; // Inverts or corrupts this whole block sector
  }

  // 6. Vector Spaceship Remnant Artifacts
  // Renders fragments of the ship vector floating ruined in the background code
  float shipMask = 0.0;
  vec2 centeredUV = (modifiedPixelCoord - 0.5 * u_resolution.xy) / u_resolution.y;
  
  // Broken floating triangle hull slices
  if (centeredUV.y > -0.2 && centeredUV.y < 0.2) {
    float widthAtY = (0.2 - centeredUV.y) * 0.6;
    if (abs(centeredUV.x) < widthAtY) {
      // Only draw chunks of the ship based on a high-frequency coordinate noise check
      if (rand(floor(modifiedPixelCoord / 8.0) + glitchTime) > 0.40) {
        shipMask = 1.0;
      }
    }
  }

  // 7. Layer Composition & Chromatic Aberration
  vec3 finalColor = androidGreen;

  if (baseGlitchMask > 0.5) {
    // Corrupted block sector pulls down to the space void color
    finalColor = glitchVoid; 
  } else if (shipMask > 0.5) {
    // Vector ruins show up as corrupted white code data
    finalColor = starWhite;
  }

  // Inject a flickering red color split channel right at the tearing seam boundaries
  if (abs(xOffset) > 0.0 && rand(pixelCoord + glitchTime) > 0.6) {
    finalColor.r = glitchRed.r;
  }

  // 8. PS1 4x4 Ordered Bayer Matrix Dithering
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

  // Apply cross-hatch shading pattern reduction
  finalColor += (ditherThreshold - 0.5) * 0.08;
  finalColor = floor(finalColor * 6.0) / 6.0; // Sharp color depth crushing

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

  // sets the current fsSource based on which secret is active
  useEffect(() => {

    let source: string;
    let sfKind: bgShaderKind;

    if (is404SecretActive) {
      // 404
      source = sh1fsSource;
      sfKind = "silent-hill";
    }
    else if (isMissingNoSecretActive) {
      // missingno
      source = missingNofsSource;
      sfKind = "missing-no";
    }
    else if (isKonamiSecretActive) {
      // konami
      source = defaultfsSource;
      sfKind = "konami-code";
    }
    else if (isAndroidSecretActive) {
      source = androidfsSource;
      sfKind = "android";
    }
    else {
      source = oceangatefsSource;
      sfKind = "oceangate";
    }

    setFsSource(source);
    setKind(sfKind);

  }, [isKonamiSecretActive, is404SecretActive, isMissingNoSecretActive, isOceangateSecretActive]);

  const render = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = contextRef.current;
    if (!gl) return;
    const program = shaderProgramRef.current;
    if (!program) return;

    const positionLocation = positionLocationRef.current;
    const positionBuffer = positionBufferRef.current;
    if (positionLocation === null || positionLocation === undefined || !positionBuffer) return;

    const seconds = time * 0.001;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocationRef.current, canvas.width, canvas.height);
    gl.uniform1f(timeUniformLocationRef.current, seconds);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    frameRef.current = requestAnimationFrame(render);
  }, []);

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = contextRef.current;
    if (!gl) return;
    if (!fsSource) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    shaderProgramRef.current = program;
    positionLocationRef.current = gl.getAttribLocation(program, 'position');
    resolutionUniformLocationRef.current = gl.getUniformLocation(program, 'u_resolution');
    timeUniformLocationRef.current = gl.getUniformLocation(program, 'u_time');

    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) return;

    positionBufferRef.current = positionBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,  1, -1, -1,  1,
        -1,  1,  1, -1,  1,  1,
      ]),
      gl.STATIC_DRAW,
    );
  }, [fsSource, vsSource]);

  // Resize handler to match screen dimensions
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = contextRef.current;
    if (!gl) return;

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(viewportWidth * dpr));
    const height = Math.max(1, Math.round(viewportHeight * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
  }, []);

  // Helper function to compile shaders
  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    contextRef.current = gl;

    const handleViewportResize = () => {
      resize();
    };

    window.addEventListener('resize', handleViewportResize);
    window.visualViewport?.addEventListener('resize', handleViewportResize);

    resize();
    setup();

    frameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleViewportResize);
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      if (shaderProgramRef.current) {
        gl.deleteProgram(shaderProgramRef.current);
      }
      if (positionBufferRef.current) {
        gl.deleteBuffer(positionBufferRef.current);
      }
      contextRef.current = null;
    };
  }, [fsSource, resize, setup]);

  return (
    <canvas
      id="webgl-canvas"
      ref={canvasRef}
      className={`secret-background ${kind} fixed top-0 left-0 w-screen h-screen -z-100 pointer-events-none`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

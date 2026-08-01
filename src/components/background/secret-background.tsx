'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSecret } from '@context/SecretContext';
import "./secret-background.css";

export default function SecretBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<WebGLRenderingContext | null>(null);
  const shaderProgramRef = useRef<WebGLProgram | null>(null);
  const positionLocationRef = useRef<number | null>(null);
  const timeUniformLocationRef = useRef<WebGLUniformLocation | null>(null);
  const resolutionUniformLocationRef = useRef<WebGLUniformLocation | null>(null);
  const positionBufferRef = useRef<WebGLBuffer | null>(null);
  const frameRef = useRef<number | null>(null);
  const { isMissingNoSecretActive, is404SecretActive, isKonamiSecretActive } = useSecret();
  const [fsSource, setFsSource] = useState<string | null>(null);

  type bgShaderKind = "silent-hill" | "konami-code" | "missing-no";

  let kind: bgShaderKind;

  if (isKonamiSecretActive) {
    kind = "konami-code";
  }
  else if (is404SecretActive) {
    kind = "silent-hill";
  }
  else {
    kind = "missing-no";
  }
  
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
  vec2 blockDimensions = vec2(8.0, 4.0);  //vec2(32.0, 12.0);

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

  // sets the current fsSource based on which secret is active
  useEffect(() => {

    if (is404SecretActive) {
      // 404
      source = sh1fsSource;
    }
    else if (isMissingNoSecretActive) {
      // missingno
      source = missingNofsSource;
    }
    else {
      // konami
      source = defaultfsSource;
    }
  
    setFsSource(source);

  }, [isKonamiSecretActive, is404SecretActive, isMissingNoSecretActive]);

  function render(time: number) {
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
  }

  function setup() {
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
  }

  // Resize handler to match screen dimensions
  function resize() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = contextRef.current;
    if (!gl) return;

    const scale = 4;
    const width = Math.floor(window.innerWidth / scale);
    const height = Math.floor(window.innerHeight / scale);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  // Helper function to compile shaders
  function createShader(gl: WebGLRenderingContext, type: number, source: string) {
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
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    contextRef.current = gl;

    window.addEventListener('resize', resize);
    resize();
    setup();

    frameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
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
  }, [fsSource]);

  return (
    <canvas
      id="webgl-canvas"
      ref={canvasRef}
      className={`${kind} fixed top-0 left-0 w-screen h-screen -z-100 pointer-events-none`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

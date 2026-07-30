'use client';

import React, { useEffect, useRef } from 'react';
import "./pixelatedBackground.css";

// 2. Define Vertex Shader (Draws a full-screen quad)
const vsSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// 3. Define Fragment Shader (Generates pixelated procedural waves)
const fsSource = `
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

export default function PixelatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<WebGLRenderingContext | null>(null);
  const shaderProgramRef = useRef<WebGLProgram | null>(null);
  const positionLocationRef = useRef<number | null>(null);
  const timeUniformLocationRef = useRef<WebGLUniformLocation | null>(null);
  const resolutionUniformLocationRef = useRef<WebGLUniformLocation | null>(null);
  const positionBufferRef = useRef<WebGLBuffer | null>(null);
  const frameRef = useRef<number | null>(null);

  // Render loop
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
  }, []);

  return (
    <canvas
      id="webgl-canvas"
      ref={canvasRef}
      className="pixelated fixed top-0 left-0 w-screen h-screen -z-100 pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
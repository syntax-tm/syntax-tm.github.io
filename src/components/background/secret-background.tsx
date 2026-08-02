'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AchievementId, useSecret } from '@context/SecretContext';
import useShader, { ShaderKind } from './shaders';
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
  const { stats } = useSecret();
  const [vsSource, setVsSource] = useState<string | null>(null);
  const [fsSource, setFsSource] = useState<string | null>(null);
  const [kind, setKind] = useState<ShaderKind | null>(null);

  // sets the current fsSource based on which secret is active
  useEffect(() => {

    let sfKind: ShaderKind;

    if (!stats) return;

    if (stats.get(AchievementId._404)?.isUnlocked) {
      sfKind = "silent_hill";
    }
    else if (stats.get(AchievementId.missing_no)?.isUnlocked) {
      sfKind = "missing_no";
    }
    else if (stats.get(AchievementId.konami_code)?.isUnlocked) {
      sfKind = "konami_code";
    }
    else if (stats.get(AchievementId.android)?.isUnlocked) {
      sfKind = "android";
    }
    else if (stats.get(AchievementId.iwhbyd)?.isUnlocked) {
      sfKind = "iwhbyd";
    }
    else if (stats.get(AchievementId.oceangate)?.isUnlocked) {
      sfKind = "oceangate";
    }
    else {
      throw new Error("No secret background shader is active.");
    }

    setKind(sfKind);

    const shader = useShader(sfKind);
    if (!shader) {
      throw new Error(`Shader source for ${sfKind} not found.`);
    }
    setFsSource(shader);

    // default vertex shader
    const vs = useShader("default");
    if (!vs) {
      throw new Error(`Shader source for 'default' not found.`);
    }

    setVsSource(vs);
  }, [stats]);

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
    if (!vsSource) return;
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

  const kindClass = kind ? kind.replace('_', '-') : '';

  return (
    <canvas
      id="webgl-canvas"
      ref={canvasRef}
      className={`secret-background ${kindClass} fixed top-0 left-0 w-screen h-screen -z-100 pointer-events-none`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

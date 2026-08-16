'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import { useSecret } from '@context/SecretContext';
import getShaderSource, { DEFAULT_SHADER_SORUCE } from './shaders';
import "./secret-background.scss";
import { useTheme } from '@context/ThemeContext';
import { useSettings } from '@stores';

export function SecretBackground() {
  const canvasId = useId();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<WebGLRenderingContext | null>(null);
  const shaderProgramRef = useRef<WebGLProgram | null>(null);
  const positionLocationRef = useRef<number | null>(null);
  const timeUniformLocationRef = useRef<WebGLUniformLocation | null>(null);
  const resolutionUniformLocationRef = useRef<WebGLUniformLocation | null>(null);
  const positionBufferRef = useRef<WebGLBuffer | null>(null);
  const frameRef = useRef<number | null>(null);
  const { id } = useSettings((state) => state);
  const { currentTheme } = useTheme();

  const vsSource = useMemo(() => DEFAULT_SHADER_SORUCE, []);
  const fsSource = useMemo(() => (id ? getShaderSource(id) ?? null : null), [id]);

  const render = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = contextRef.current;
    if (!gl) return;
    const program = shaderProgramRef.current;
    if (!program) return;

    const positionLocation = positionLocationRef.current;
    const positionBuffer = positionBufferRef.current;
    if (positionLocation === null || positionBuffer === null) return;

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

    if (positionLocationRef.current === null) {
      console.error('Failed to resolve shader position attribute.');
      return;
    }

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
        gl?.deleteProgram(shaderProgramRef.current);
      }
      if (positionBufferRef.current) {
        gl?.deleteBuffer(positionBufferRef.current);
      }
      // const extension = gl?.getExtension('WEBGL_lose_context');
      // extension?.loseContext();
      contextRef.current = null;
    };
  }, [fsSource, resize, setup]);

  return (
    <canvas
      id={canvasId}
      ref={canvasRef}
      className={`background secret-bg secret-background ${currentTheme?.className} fixed top-0 left-0 w-screen h-screen -z-100 pointer-events-none`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

export { SecretBackground as default };

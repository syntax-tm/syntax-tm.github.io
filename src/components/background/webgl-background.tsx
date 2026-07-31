"use client";

import React, { useEffect, useRef } from 'react';
import './background.css';

// Vertex shader (passthrough).
const vertexShaderSource = `
attribute vec2 aVertexPosition;
void main() {
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}
`;

// Fragment shader (animated wave effect + gradient).
const fragmentShaderSource = `
precision highp float;

// Elapsed time in seconds.
uniform float uTime;
// Viewport resolution.
uniform vec2  uResolution;
// Horizontal gradient stops.
uniform float uGradientStops[4];
uniform vec3  uGradientColors[4];

const float waveWidthFactor = 1.5;

vec3 calcSine(
	vec2 uv,
	float speed,
	float frequency,
	float amplitude,
	float phaseShift,
	float verticalOffset,
	vec3 baseColor,
	float lineWidth,
	float sharpness,
	bool invertFalloff
) {

	// Compute wave position.
	float angle = uTime * speed * frequency * -1.0 + (phaseShift + uv.x) * 2.0;
	float waveY = sin(angle) * amplitude + verticalOffset;
	float deltaY = waveY - uv.y;
	float distanceVal  = distance(waveY , uv.y);

	// amplify falloff on one side.
	if (invertFalloff) {
		if (deltaY > 0.0) {
			distanceVal = distanceVal * 8.0;
		}
	} else {
		if (deltaY < 0.0) {
			distanceVal = distanceVal * 8.0;
		}
	}

	float smoothVal = smoothstep(lineWidth * waveWidthFactor, 0.0, distanceVal);
	float scaleVal  = pow(smoothVal, sharpness);

	return min(baseColor * scaleVal, baseColor);
}

vec3 getGradientColor(vec2 uv) {
	float animatedX = clamp(uv.x + 0.08 * sin(uTime * 0.18 + uv.y * 1.6), 0.0, 1.0);
	vec3 color = vec3(0.0);
	float totalWeight = 0.0;

	for (int i = 0; i < 2; i++) {
		float timeShift = 0.05 * sin(uTime * 0.2 + float(i) * 0.8 + uv.y * 0.4);
    // float timeShift = 0.05 * sin(uTime * 0.2 + float(i) * 0.8 + uv.y * 0.4);
		float stop = clamp(uGradientStops[i] + timeShift, 0.0, 1.0);
		vec3 stopColor = uGradientColors[i];

		float distanceToStop = abs(animatedX - stop);
		float weight = 1.0 / max(distanceToStop * 2.0 + 0.15, 0.0001);
    // float weight = 1.0 / max(distanceToStop * 1.8 + 0.15, 0.0001);
		color += stopColor * weight;
		totalWeight += weight;
	}

	return color / max(totalWeight, 0.0001);
}

void main() {
	// Normalize fragment coords.
	vec2 uv = gl_FragCoord.xy / uResolution;

	vec3 backgroundColor = getGradientColor(uv);

	// Accumulate wave colors.
	vec3 accumulatedColor = vec3(0.0);
	accumulatedColor += calcSine(uv, 0.2, 0.20, 0.2, 0.0, 0.5,  vec3(0.2), 0.1, 15.0, false);
	accumulatedColor += calcSine(uv, 0.4, 0.40, 0.15, 0.0, 0.5, vec3(0.2), 0.1, 17.0, false);
	accumulatedColor += calcSine(uv, 0.3, 0.60, 0.15, 0.0, 0.5, vec3(0.2), 0.05, 23.0, false);
	accumulatedColor += calcSine(uv, 0.1, 0.26, 0.07, 0.0, 0.3, vec3(0.2), 0.1, 17.0, true);
	accumulatedColor += calcSine(uv, 0.3, 0.36, 0.07, 0.0, 0.3, vec3(0.2), 0.1, 17.0, true);
	accumulatedColor += calcSine(uv, 0.5, 0.46, 0.07, 0.0, 0.3, vec3(0.2), 0.05, 23.0, true);
	accumulatedColor += calcSine(uv, 0.2, 0.58, 0.05, 0.0, 0.3, vec3(0.2), 0.2, 15.0, true);

	// Determine mask from max channel.
	float maxChannel = accumulatedColor.r;

	if (accumulatedColor.g > maxChannel) {
		maxChannel = accumulatedColor.g;
	}

	if (accumulatedColor.b > maxChannel) {
		maxChannel = accumulatedColor.b;
	}

	// Blend the animated waves over the moving gradient.
	vec3 outputColor = backgroundColor;

	if (maxChannel > 0.0) {
		outputColor = mix(backgroundColor, accumulatedColor, 0.1); // 0.8
	}

	// Output final color.
	gl_FragColor = vec4(outputColor, 1.0);
}
`;

const hexToShaderVec3 = (hex: string, precision: number = 4) => {
  // remove the hash if present
  hex = hex.replace(/^#/, '');

  let r, g, b;

  // if only 3 character format
  if (hex.length === 3) {
    const old = hex;
    r = parseInt(old[0].repeat(2), 16);
    g = parseInt(old[1].repeat(2), 16);
    b = parseInt(old[2].repeat(2), 16);
  }
  else if (hex.length === 6) {
    // parse hex values to integers
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  else {
    throw new Error(`Unknown hex color format ('${hex}').`);
  }

  // normalize to 0.0 - 1.0 range and round for clean shader floats
  return [
    parseFloat((r / 255).toFixed(precision)),
    parseFloat((g / 255).toFixed(precision)),
    parseFloat((b / 255).toFixed(precision)),
  ];
};

const hexToShaderVec4 = (hex: string, precision: number = 4) => {
  // remove the hash if present
  hex = hex.replace(/^#/, '');

  let r, g, b, a;

  // if only 3 character format
  if (hex.length === 3) {
    const old = hex;
    r = parseInt(old[0].repeat(2), 16);
    g = parseInt(old[1].repeat(2), 16);
    b = parseInt(old[2].repeat(2), 16);
    a = 255;
  }
  else if ([6, 8].includes(hex.length)) {
    // default alpha to 255 (1.0) if not provided
    if (hex.length === 6) {
      hex += 'ff';
    }

    // parse hex values to integers
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    a = parseInt(hex.substring(6, 8), 16);
  }
  else {
    throw new Error(`Unknown hex color format ('${hex}').`);
  }

  // normalize to 0.0 - 1.0 range and round for clean shader floats
  return [
    parseFloat((r / 255).toFixed(precision)),
    parseFloat((g / 255).toFixed(precision)),
    parseFloat((b / 255).toFixed(precision)),
    parseFloat((a / 255).toFixed(precision)),
  ];
};

const gradientStops = [
  { offset: 0.0, color: [0.455, 0.310, 0.553] as [number, number, number] },
  { offset: 0.25, color: [0.451, 0.345, 0.694] as [number, number, number] },
  { offset: 0.5, color: [0.357, 0.420, 0.702] as [number, number, number] },
  { offset: 0.75, color: [0.365, 0.780, 0.780] as [number, number, number] },
  { offset: 1.0, color: [0.463, 0.788, 0.588] as [number, number, number] },
];

export default function WebGlBackground() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<WebGLRenderingContext | null>(null);
  const shaderProgramRef = useRef<WebGLProgram | null>(null);
  const timeUniformLocationRef = useRef<WebGLUniformLocation | null>(null);
  const resolutionUniformLocationRef = useRef<WebGLUniformLocation | null>(null);

  // draw each animation frame.
  const renderFrame = (timeMs: number) => {
    if (!contextRef.current) return;
    const context = contextRef.current;

    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    context.clear(context.COLOR_BUFFER_BIT);

    const timeSec = timeMs * 0.001;

    context.uniform1f(timeUniformLocationRef.current, timeSec);
    context.uniform2f(resolutionUniformLocationRef.current, canvas.width, canvas.height);
    context.drawArrays(context.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(renderFrame);
  };

  // Compile shader and log errors.
  const compileShader = (source: string, type: number) => {
    if (!contextRef.current) return;

    const context = contextRef.current;
    const shader = context.createShader(type);

    if (!shader) return;

    context.shaderSource(shader, source);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      console.error("Shader error:", context.getShaderInfoLog(shader));
      context.deleteShader(shader);

      return null;
    }

    return shader;
  };

  // setup shaders, buffers, and start render loop.
  const initializeWebGL = () => {
    if (!contextRef.current) return;

    const context = contextRef.current;

    const vs = compileShader(vertexShaderSource, context.VERTEX_SHADER);
    const fs = compileShader(fragmentShaderSource, context.FRAGMENT_SHADER);

    if (!vs || !fs) return;

    const shaderProgram = context.createProgram();

    shaderProgramRef.current = shaderProgram;

    context.attachShader(shaderProgram, vs);
    context.attachShader(shaderProgram, fs);
    context.linkProgram(shaderProgram);

    if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS)) {
      console.error("Link error:", context.getProgramInfoLog(shaderProgram));
    }

    context.useProgram(shaderProgram);

    // Get attribute/uniform locations.
    const posLoc = context.getAttribLocation(shaderProgram, "aVertexPosition");

    const timeLocation = context.getUniformLocation(shaderProgram, "uTime");
    if (!timeLocation) return;
    timeUniformLocationRef.current = timeLocation;

    const resolutionLocation = context.getUniformLocation(shaderProgram, "uResolution");
    if (!resolutionLocation) return;
    resolutionUniformLocationRef.current = resolutionLocation;

    //context.clearColor(1.0, 1.0, 1.0, 0.2);
    //context.clearColor(0.0, 0.0, 0.0, 1.0);
    //context.clearColor(1.0, 1.0, 1.0, 0.1);

    gradientStops.forEach((stop, index) => {
      const stopLocation = context.getUniformLocation(shaderProgram, `uGradientStops[${index}]`);
      const colorLocation = context.getUniformLocation(shaderProgram, `uGradientColors[${index}]`);

      if (stopLocation) {
        context.uniform1f(stopLocation, stop.offset);
      }

      if (colorLocation) {
        context.uniform3fv(colorLocation, stop.color);
      }
    });

    // Full-screen quad buffer.
    const buffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, buffer);

    const verts = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]);

    context.bufferData(context.ARRAY_BUFFER, verts, context.STATIC_DRAW);
    context.enableVertexAttribArray(posLoc);
    context.vertexAttribPointer(posLoc, 2, context.FLOAT, false, 0, 0);

    requestAnimationFrame(renderFrame);
  };

  useEffect(() => {
    const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement | null;

    if (!canvas) {
      console.error("WebGL canvas not found");
      return;
    }

    canvasRef.current = canvas;

    const context = canvas.getContext("webgl", { alpha: true, antialias: true });
    contextRef.current = context;

    if (!context) {
      console.error("WebGL not supported");
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    initializeWebGL();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };

  }, [initializeWebGL]);

  return (
    <>
      <canvas id="webgl-canvas" ref={canvasRef} className="absolute left-0 top-0 w-full h-full -z-5"></canvas>
    </>
  );
}

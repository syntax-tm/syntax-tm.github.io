"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef } from "react";
import Image from "next/image";
import { useSettings } from "@stores";
import { useTheme } from "@context";
import { DEFAULT_SHADER_SORUCE } from "@components/background";
import CoupleImage from "svg/couple.svg?url";

const fragmentShader = /* glsl */ `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define FIREWORKS 4 // 7
#define PARTICLES 64 // 64

// ------------------------------------------------------------
// Random functions
// ------------------------------------------------------------

float hash(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

float hash2(vec2 p) {
  return fract(
    sin(
      dot(
        p,
        vec2(127.1, 311.7)
      )
    ) * 43758.5453123
  );
}

// ------------------------------------------------------------
// 2D rotation
// ------------------------------------------------------------

mat2 rotate(float a) {
  float c = cos(a);
  float s = sin(a);

  return mat2(
    c, -s,
    s,  c
  );
}

// ------------------------------------------------------------
// Pixelated square particle
// ------------------------------------------------------------

float pixel(
  vec2 uv,
  vec2 position,
  float size
) {

  vec2 d = abs(uv - position);

  vec2 box = step(
    d,
    vec2(size)
  );

  return box.x * box.y;
}

// ------------------------------------------------------------
// Pixelated glow
// ------------------------------------------------------------

float pixelGlow(
  vec2 uv,
  vec2 position,
  float radius
) {

  vec2 d = abs(uv - position);

  float distance =
    max(d.x, d.y);

  return 1.0 -
    smoothstep(
      0.0,
      radius,
      distance
    );
}

// ------------------------------------------------------------
// Firework color palette
// ------------------------------------------------------------

vec3 fireworkColor(float id) {

  float n = mod(id, 6.0);

  if (n < 1.0)
    return vec3(1.0, 0.18, 0.08);

  if (n < 2.0)
    return vec3(1.0, 0.75, 0.08);

  if (n < 3.0)
    return vec3(0.10, 0.55, 1.0);

  if (n < 4.0)
    return vec3(0.75, 0.12, 1.0);

  if (n < 5.0)
    return vec3(0.05, 1.0, 0.65);

  return vec3(1.0, 0.15, 0.65);
}

// ------------------------------------------------------------
// HEART POSITION
// ------------------------------------------------------------

vec2 heartPosition(float id) {

  float x =
    hash(id * 17.31);

  float y =
    hash(id * 31.71);

  return vec2(x, y);
}

// ------------------------------------------------------------
// Firework origin
// ------------------------------------------------------------

vec2 fireworkOrigin(float id) {

  float x =
    hash(id * 14.17);

  float y =
    hash(id * 29.73);

  return vec2(x, y);
}

// ------------------------------------------------------------
// Firework launch position
// ------------------------------------------------------------

vec2 launchPosition(
  float id,
  float t
) {

  vec2 origin =
    fireworkOrigin(id);

  float targetHeight =
    mix(
      0.20,
      0.95,
      hash(id * 9.17)
    );

  float launchProgress =
    clamp(
      t / 1.25,
      0.0,
      1.0
    );

  // Ease out slightly
  launchProgress =
    1.0 -
    pow(
      1.0 - launchProgress,
      1.7
    );

  return vec2(
    origin.x,
    mix(
      0.0,
      targetHeight,
      launchProgress
    )
  );
}

// ------------------------------------------------------------
// Firework explosion
// ------------------------------------------------------------

float renderExplosion(
  vec2 uv,
  float id,
  float explosionTime,
  float lifetime
) {

  float result = 0.0;

  vec2 center =
    launchPosition(
      id,
      1.25
    );

  vec3 color =
    fireworkColor(id);

  // Explosion expansion
  float expansion =
    min(
      explosionTime * 0.52,
      0.42
    );

  // Gravity
  float gravity =
    explosionTime *
    explosionTime *
    0.12;

  for (int j = 0; j < PARTICLES; j++) {

    float particleId =
      float(j);

    // Deterministic direction
    float angle =
      hash(
        id * 100.0 +
        particleId * 7.31
      ) * PI * 2.0;

    // Different particle velocities
    float velocity =
      mix(
        0.45,
        1.15,
        hash(
          id * 73.1 +
          particleId * 11.7
        )
      );

    // Slightly irregular explosion
    float variation =
      0.85 +
      0.15 *
      sin(
        particleId * 12.71 +
        id * 4.2
      );

    vec2 direction =
      vec2(
        cos(angle),
        sin(angle)
      );

    vec2 position =
      center +
      direction *
      expansion *
      velocity *
      variation;

    // Gravity
    position.y -= gravity;

    // Some particles curve slightly
    position.x +=
      sin(
        explosionTime * 3.0 +
        particleId
      ) *
      0.003;

    // Pixel-sized particle
    float particleSize =
      0.0025 +
      hash(
        particleId * 2.31 +
        id * 18.7
      ) *
      0.002;

    float p =
      pixel(
        uv,
        position,
        particleSize
      );

    // Particle fade
    float fade =
      1.0 -
      smoothstep(
        lifetime * 0.35,
        lifetime,
        explosionTime
      );

    // Individual flickering
    float flicker =
      0.65 +
      0.35 *
      sin(
        u_time * 14.0 +
        particleId * 5.7
      );

    result +=
      p *
      fade *
      flicker;

    // Small glow around some particles
    float glow =
      pixelGlow(
        uv,
        position,
        particleSize * 4.0
      );

    result +=
      glow *
      fade *
      0.10;
  }

  // ----------------------------------------------------------
  // Bright explosion center
  // ----------------------------------------------------------

  float core =
    pixelGlow(
      uv,
      center,
      0.025
    );

  core *=
    1.0 -
    smoothstep(
      0.0,
      lifetime,
      explosionTime
    );

  result +=
    core *
    1.5;

  return result;
}

float renderHeartRocket(
  vec2 uv,
  float id,
  float localTime
) {

  // Rocket launch duration
  float launchDuration = 1.15;

  if (
    localTime < 0.0 ||
    localTime >= launchDuration
  ) {
    return 0.0;
  }

  // Random target position for this heart
  vec2 target =
    heartPosition(id);

  // Launch vertically from the bottom
  vec2 start =
    vec2(
      target.x,
      0.015
    );

  // 0 → 1 during launch
  float progress =
    localTime /
    launchDuration;

  // Ease out toward the target
  float eased =
    1.0 -
    pow(
      1.0 - progress,
      2.0
    );

  vec2 position =
    mix(
      start,
      target,
      eased
    );

  float result = 0.0;

  // ----------------------------------------------------------
  // Rocket head
  // ----------------------------------------------------------

  result +=
    pixel(
      uv,
      position,
      0.0035
    );

  // ----------------------------------------------------------
  // Pixelated rocket trail
  // ----------------------------------------------------------

  for (int i = 1; i < 12; i++) {

    float fi =
      float(i);

    float trailProgress =
      progress -
      fi * 0.025;

    if (
      trailProgress <= 0.0
    ) {
      continue;
    }

    float trailEase =
      1.0 -
      pow(
        1.0 - trailProgress,
        2.0
      );

    vec2 trailPosition =
      mix(
        start,
        target,
        trailEase
      );

    float trailFade =
      1.0 -
      fi / 13.0;

    result +=
      pixel(
        uv,
        trailPosition,
        0.0023
      ) *
      trailFade;
  }

  return result;
}

// ------------------------------------------------------------
// Launching rocket
// ------------------------------------------------------------

float renderRocket(
  vec2 uv,
  float id,
  float t
) {

  if (t > 1.30)
    return 0.0;

  vec2 position =
    launchPosition(
      id,
      t
    );

  float result = 0.0;

  // Main rocket pixel
  result +=
    pixel(
      uv,
      position,
      0.003
    );

  // Pixelated trail
  for (int i = 1; i < 7; i++) {

    float fi =
      float(i);

    float trailTime =
      t -
      fi * 0.035;

    if (trailTime <= 0.0)
      continue;

    vec2 trailPosition =
      launchPosition(
        id,
        trailTime
      );

    float fade =
      1.0 -
      fi / 8.0;

    result +=
      pixel(
        uv,
        trailPosition,
        0.0022
      ) *
      fade;
  }

  return result;
}

// ------------------------------------------------------------
// HEART SHAPE
// ------------------------------------------------------------

vec2 heartPoint(float t) {

  float x =
    16.0 *
    pow(sin(t), 3.0);

  float y =
    13.0 * cos(t)
    - 5.0 * cos(2.0 * t)
    - 2.0 * cos(3.0 * t)
    - cos(4.0 * t);

  // Positive Y keeps the heart correctly oriented.
  return vec2(
    x / 18.0,
    y / 18.0
  );
}

// ------------------------------------------------------------
// RANDOM HEART SIZE
//
// Produces noticeably different sizes while keeping them
// within a reasonable range.
// ------------------------------------------------------------

float heartSize(float id) {

  return mix(
    0.12,
    0.31,
    hash(id * 73.17)
  );
}

// ------------------------------------------------------------
// SPECIAL 5 SECOND HEART ROCKET
// ------------------------------------------------------------

float renderFinalHeartRocket(
  vec2 uv,
  float time
) {

  float launchStart =
    3.75;

  float explosionTime =
    5.0;

  if (
    time < launchStart ||
    time >= explosionTime
  ) {
    return 0.0;
  }

  float progress =
    (time - launchStart) /
    (explosionTime - launchStart);

  float eased =
    1.0 -
    pow(
      1.0 - progress,
      2.0
    );

  vec2 start =
    vec2(
      0.50,
      0.015
    );

  vec2 target =
    vec2(
      0.50,
      0.60
    );

  vec2 position =
    mix(
      start,
      target,
      eased
    );

  float result = 0.0;

  // Rocket
  result +=
    pixel(
      uv,
      position,
      0.004
    );

  // Trail
  for (int i = 1; i < 14; i++) {

    float fi =
      float(i);

    float trailProgress =
      progress -
      fi * 0.023;

    if (
      trailProgress <= 0.0
    ) {
      continue;
    }

    float trailEase =
      1.0 -
      pow(
        1.0 - trailProgress,
        2.0
      );

    vec2 trailPosition =
      mix(
        start,
        target,
        trailEase
      );

    result +=
      pixel(
        uv,
        trailPosition,
        0.0025
      ) *
      (1.0 - fi / 15.0);
  }

  return result;
}

// ------------------------------------------------------------
// HEART EXPLOSION WITH PIXEL TRAILS
// ------------------------------------------------------------

float renderHeartExplosion(
  vec2 uv,
  float id,
  float explosionTime,
  float lifetime
) {

  float result = 0.0;

  vec2 center =
    heartPosition(id);

  // ----------------------------------------------------------
  // Explosion expansion
  // ----------------------------------------------------------

  float expansion =
    smoothstep(
      0.0,
      0.72,
      explosionTime
    );

  // Random size for this particular heart
  float scale =
    heartSize(id);

  float currentScale =
    scale *
    expansion;

  // ----------------------------------------------------------
  // Overall fade
  // ----------------------------------------------------------

  float fade =
    1.0 -
    smoothstep(
      lifetime * 0.35,
      lifetime,
      explosionTime
    );

  // ----------------------------------------------------------
  // 128 particles form the heart
  // ----------------------------------------------------------

  for (int i = 0; i < 128; i++) {

    float fi =
      float(i);

    // Evenly distribute particles around the heart
    float t =
      (fi / 128.0) *
      6.28318530718;

    vec2 heart =
      heartPoint(t);

    // --------------------------------------------------------
    // Random variation
    // --------------------------------------------------------

    float randomAmount =
      hash(
        id * 71.3 +
        fi * 13.7
      );

    // Slightly imperfect particle position
    vec2 jitter =
      vec2(
        hash(
          id * 4.3 +
          fi * 1.7
        ) - 0.5,

        hash(
          id * 9.7 +
          fi * 2.3
        ) - 0.5
      );

    // --------------------------------------------------------
    // Current particle position
    // --------------------------------------------------------

    vec2 direction =
      heart *
      currentScale;

    vec2 particlePosition =
      center +
      direction;

    particlePosition +=
      jitter *
      0.0025 *
      randomAmount;

    // --------------------------------------------------------
    // Particle size
    // --------------------------------------------------------

    float particleSize =
      mix(
        0.0018,
        0.0042,
        hash(
          id * 19.7 +
          fi * 3.71
        )
      );

    // --------------------------------------------------------
    // MAIN PARTICLE
    // --------------------------------------------------------

    float particle =
      pixel(
        uv,
        particlePosition,
        particleSize
      );

    // --------------------------------------------------------
    // PIXEL TRAIL
    //
    // Each particle leaves several pixels behind it along
    // its expansion path.
    // --------------------------------------------------------

    for (int j = 1; j < 7; j++) {

      float fj =
        float(j);

      // Distance behind the particle
      float trailOffset =
        fj * 0.045;

      // Keep the trail behind the expanding particle
      float trailExpansion =
        max(
          expansion -
          trailOffset,
          0.0
        );

      vec2 trailPosition =
        center +
        heart *
        scale *
        trailExpansion;

      trailPosition +=
        jitter *
        0.0025 *
        randomAmount;

      // Trail gets smaller toward the back
      float trailSize =
        particleSize *
        (
          0.85 -
          fj * 0.095
        );

      // Make sure it doesn't become negative
      trailSize =
        max(
          trailSize,
          0.0007
        );

      float trailPixel =
        pixel(
          uv,
          trailPosition,
          trailSize
        );

      // ------------------------------------------------------
      // Trail glow
      // ------------------------------------------------------

      float trailGlow =
        pixelGlow(
          uv,
          trailPosition,
          trailSize * 4.5
        );

      float trailFade =
        1.0 -
        fj / 7.0;

      // Slightly dimmer than the main particle
      result +=
        trailPixel *
        trailFade *
        0.70;

      result +=
        trailGlow *
        trailFade *
        0.08;
    }

    // --------------------------------------------------------
    // Main particle flicker
    // --------------------------------------------------------

    float flicker =
      0.70 +
      0.30 *
      sin(
        u_time * 18.0 +
        fi * 5.7 +
        id
      );

    result +=
      particle *
      fade *
      flicker;

    // --------------------------------------------------------
    // Glow around main particle
    // --------------------------------------------------------

    float particleGlow =
      pixelGlow(
        uv,
        particlePosition,
        particleSize * 4.5
      );

    result +=
      particleGlow *
      fade *
      0.12;
  }

  // ----------------------------------------------------------
  // Bright explosion center
  // ----------------------------------------------------------

  float core =
    pixelGlow(
      uv,
      center,
      0.025
    );

  core *=
    1.0 -
    smoothstep(
      0.0,
      0.65,
      explosionTime
    );

  result +=
    core *
    1.6;

  return result;
}

// ------------------------------------------------------------
// Atmospheric pixel stars
// ------------------------------------------------------------

float stars(vec2 uv) {

  float result = 0.0;

  for (int i = 0; i < 70; i++) {

    float fi =
      float(i);

    vec2 position =
      vec2(
        hash(fi * 3.71),
        hash(fi * 9.17)
      );

    // Keep stars relatively dim
    float brightness =
      mix(
        0.05,
        0.25,
        hash(fi * 2.17)
      );

    float size =
      mix(
        0.0008,
        0.0018,
        hash(fi * 4.71)
      );

    result +=
      pixel(
        uv,
        position,
        size
      ) *
      brightness;
  }

  return result;
}

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------

void main() {

  float pixelSize = 6.0; // control pixel clump size

  // 1. quantize screen space coordinates
  vec2 pixelCoord = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
  vec2 uv = pixelCoord / u_resolution;

  // ----------------------------------------------------------
  // Pixelation
  // ----------------------------------------------------------

  vec2 pixelResolution =
    u_resolution /
    pixelSize;

  vec2 pixelUv =
    floor(
      uv *
      pixelResolution
    ) /
    pixelResolution;

  // Use pixelated coordinates for everything
  uv = pixelUv;

  // ----------------------------------------------------------
  // Aspect correction
  // ----------------------------------------------------------

  // vec2 centered =
  //   uv -
  //   0.5;

  // centered.x *=
  //   u_resolution.x /
  //   u_resolution.y;

  // uv =
  //   centered +
  //   0.5;

  vec2 centered = uv;

  // ----------------------------------------------------------
  // Background
  // ----------------------------------------------------------

  vec3 color =
    vec3(
      0.003,
      0.004,
      0.012
    );

  // Very subtle blue horizon
  float horizon =
    exp(
      -abs(
        uv.y -
        0.42
      ) * 8.0
    );

  color +=
    vec3(
      0.002,
      0.008,
      0.025
    ) *
    horizon;

  // ----------------------------------------------------------
  // Stars
  // ----------------------------------------------------------

  float starField =
    stars(uv);

  color +=
    vec3(
      0.15,
      0.22,
      0.40
    ) *
    starField;

  // ----------------------------------------------------------
  // Fireworks
  // ----------------------------------------------------------

  for (int i = 0; i < FIREWORKS; i++) {

    float id =
      float(i);

    // Different timing for every firework
    float cycle =
      3.4 +
      hash(id * 12.31) *
      1.4;

    float phase =
      hash(id * 42.17) *
      cycle;

    float localTime =
      mod(
        u_time +
        phase,
        cycle
      );

    // Explosion begins after launch
    float explosionTime =
      localTime -
      1.18;

    vec3 fireColor =
      fireworkColor(id);

    // Rocket
    float rocket =
      renderRocket(
        uv,
        id,
        localTime
      );

    color +=
      fireColor *
      rocket *
      1.5;

    // Explosion
    if (
      explosionTime > 0.0 &&
      explosionTime < 2.3
    ) {

      float explosion =
        renderExplosion(
          uv,
          id,
          explosionTime,
          2.3
        );

      color +=
        fireColor *
        explosion;

      // Hot white/yellow core
      float core =
        explosion *
        0.18;

      color +=
        vec3(
          1.0,
          0.85,
          0.55
        ) *
        core;
    }
  }

  // ------------------------------------------------------------
// RANDOM HEART FIREWORKS
// ------------------------------------------------------------

#define HEART_FIREWORKS 2

for (int i = 0; i < HEART_FIREWORKS; i++) {

  float id =
    float(i);

  // ----------------------------------------------------------
  // Each heart has its own cycle
  // ----------------------------------------------------------

  float cycle =
    mix(
      4.0,
      7.5,
      hash(id * 27.13)
    );

  float phase =
    hash(id * 51.73) *
    cycle;

  float absoluteTime =
    u_time +
    phase;

  float localTime =
    mod(
      absoluteTime,
      cycle
    );

  // Changes every time this particular firework repeats
  float cycleNumber =
    floor(
      absoluteTime /
      cycle
    );

  float heartId =
    id +
    100.0 +
    cycleNumber *
    17.731;

  // ----------------------------------------------------------
  // Heart color
  // ----------------------------------------------------------

  float colorRandom =
    hash(
      heartId * 12.31
    );

  vec3 heartColor;

  if (colorRandom < 0.33) {

    heartColor =
      vec3(
        1.0,
        0.04,
        0.18
      );

  } else if (colorRandom < 0.66) {

    heartColor =
      vec3(
        1.0,
        0.10,
        0.55
      );

  } else {

    heartColor =
      vec3(
        1.0,
        0.30,
        0.75
      );
  }

  // ----------------------------------------------------------
  // Rocket
  // ----------------------------------------------------------

  float rocket =
    renderHeartRocket(
      uv,
      heartId,
      localTime
    );

  color +=
    heartColor *
    rocket *
    1.8;

  // ----------------------------------------------------------
  // Explosion
  // ----------------------------------------------------------

  float explosionTime =
    localTime -
    1.15;

  if (
    explosionTime > 0.0 &&
    explosionTime < 2.7
  ) {

    float heart =
      renderHeartExplosion(
        uv,
        heartId,
        explosionTime,
        2.7
      );

    color +=
      heartColor *
      heart;

    // Hot white/pink highlights
    color +=
      vec3(
        1.0,
        0.78,
        0.72
      ) *
      heart *
      0.20;
  }
}

  // // ----------------------------------------------------------
  // // Mouse-reactive ambient glow
  // // ----------------------------------------------------------

  // vec2 mouse =
  //   uMouse *
  //   0.04;

  // float mouseGlow =
  //   1.0 -
  //   smoothstep(
  //     0.0,
  //     0.7,
  //     length(
  //       centered -
  //       mouse
  //     )
  //   );

  // color +=
  //   vec3(
  //     0.005,
  //     0.01,
  //     0.025
  //   ) *
  //   mouseGlow;

  // ----------------------------------------------------------
  // Vignette
  // ----------------------------------------------------------

  float vignette =
    1.0 -
    dot(
      centered,
      centered
    ) *
    1.25;

  color *=
    clamp(
      vignette,
      0.25,
      1.0
    );

  // ----------------------------------------------------------
  // Final pixel-art color
  // ----------------------------------------------------------

  color =
    max(
      color,
      vec3(0.0)
    );

  gl_FragColor =
    vec4(
      color,
      1.0
    );
  }
`;

export function BrixBoot() {

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
  const fsSource = useMemo(() => (fragmentShader), [id]);

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

  // resize handler to match screen dimensions
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

  // helper function to compile shaders
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
      contextRef.current = null;
    };
  }, [fsSource, resize, setup]);

  return (
    <>
      <canvas
        id={canvasId}
        ref={canvasRef}
        className={`brix-boot ${currentTheme?.className} fixed top-0 left-0 w-screen h-screen -z-100 pointer-events-none`}
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="grid w-full h-full">
        <img src={'svg/couple.svg'} alt="people" className="absolute bottom-0 left-0 w-full h-full z-200" />
      </div>
    </>
  );
}

export { BrixBoot as default };

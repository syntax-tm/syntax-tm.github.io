"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const FRAGMENT_A = `
uniform float iOffsetX;

float pi = 3.14159265358979323;

#define clamps(x) clamp(x, 0., 1.)

vec3 rX(vec3 p, float a) {
  float c, s;
  vec3 q = p;
  c = cos(a);
  s = sin(a);
  p.y = c * q.y - s * q.z;
  p.z = s * q.y + c * q.z;
  return p;
}

vec3 rY(vec3 p, float a) {
  float c, s;
  vec3 q = p;
  c = cos(a);
  s = sin(a);
  p.x = c * q.x + s * q.z;
  p.z = -s * q.x + c * q.z;
  return p;
}

vec3 rZ(vec3 p, float a) {
  float c, s;
  vec3 q = p;
  c = cos(a);
  s = sin(a);
  p.x = c * q.x - s * q.y;
  p.y = s * q.x + c * q.y;
  return p;
}

vec2 dirDist(float dir, float dist) {
  return vec2(cos(dir) * dist, sin(dir) * dist);
}

vec3 animation(vec2 uv, float time) {
  float circles = 0.;

  for(float k = 0.; k < 8.; k++) {
    float DIRECTION = time * k * 0.1;
    float DISTANCE = 0.2;

    vec3 POSITION =
      vec3(dirDist(DIRECTION, DISTANCE), 0.);

    POSITION = rY(POSITION, time * 1.1);
    POSITION = rZ(POSITION, time * 2.15);
    POSITION = rX(POSITION, time * 0.52);

    circles = max(
      circles,
      clamps(
        1. - (length(uv - POSITION.xy) * 40.)
      )
    );
  }

  circles = clamp(circles, 0., 1.);

  return vec3(circles);
}

void mainImage(
  out vec4 fragColor,
  in vec2 fragCoord
) {
  vec2 uv = fragCoord.xy / iResolution.xy;

  vec2 suv = uv - .5;
  suv.x /= iResolution.y / iResolution.x;
  suv.x -= iOffsetX;

  vec3 drawing = animation(suv, iTime);

  drawing = vec3(
    pow(drawing, vec3(2.5, 1.8, 1.))
  );

  fragColor = vec4(drawing, 1.);
}
`;

const FRAGMENT_B = `
#define clamps(x) clamp(x, 0., 1.)

float pi = 3.14159265358979323;

vec2 circle(float a){
  return vec2(cos(a), sin(a));
}

void mainImage(
  out vec4 fragColor,
  in vec2 fragCoord
) {
  vec2 uv = fragCoord.xy / iResolution.xy;

  vec4 d = vec4(0);

  #define L 8.

  for (float i = 0.; i < L; i++) {
    vec2 p = circle((i / L) * pi * 2.);
    p.x /= iResolution.x / iResolution.y;

    d = max(
      d,
      texture2D(
        iChannel1,
        uv + (p * 0.00015)
      )
    );
  }

  fragColor =
    (texture2D(iChannel0, uv) * 0.85)
    + (clamps(d) * 0.5);
}
`;

const FRAGMENT_IMAGE = `
#define clamps(x) clamp(x, 0. , 1.)

void mainImage(
  out vec4 fragColor,
  in vec2 fragCoord
) {
  vec2 uv = fragCoord.xy / iResolution.xy;

  vec4 base =
    texture2D(iChannel0, uv)
    + texture2D(iChannel1, uv);

  float alpha =
    clamps(length(base.xyz) * 2.0);

  fragColor =
    vec4(base.xyz, alpha);
}
`;

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_PREFIX = `
uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
varying vec2 vUv;
`;

const FRAGMENT_SUFFIX = `
void main() {
  vec4 fragColor = vec4(0.0);
  vec2 fragCoord = vUv * iResolution.xy;
  mainImage(fragColor, fragCoord);
  gl_FragColor = fragColor;
}
`;

type FragmentType = "A" | "B" | "IMAGE";

const getFragment = (type: FragmentType) => {
  let code;
  if (type === "A") code = FRAGMENT_A;
  else if (type === "B") code = FRAGMENT_B;
  else code = FRAGMENT_IMAGE;

  const fragment = FRAGMENT_PREFIX +
    code +
    FRAGMENT_SUFFIX;

  return fragment;
};

export function WebGLOrbs2() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef(new THREE.Timer());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);

    const options = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
    };

    const rtA = new THREE.WebGLRenderTarget(width, height, options);
    const rtB1 = new THREE.WebGLRenderTarget(width, height, options);
    const rtB2 = new THREE.WebGLRenderTarget(width, height, options);

    const uniformsA = {
      iResolution: { value: new THREE.Vector3(width, height, 1) },
      iTime: { value: 0 },
      iOffsetX: { value: 0.0 },
    };

    const materialA = new THREE.ShaderMaterial({
      uniforms: uniformsA,
      vertexShader: VERTEX_SHADER,
      fragmentShader: getFragment("A"),
      depthWrite: false,
      depthTest: false,
    });

    const uniformsB = {
      iResolution: { value: new THREE.Vector3(width, height, 1) },
      iTime: { value: 0 },
      iChannel0: { value: null },
      iChannel1: { value: rtA.texture },
    };

    const materialB = new THREE.ShaderMaterial({
      uniforms: uniformsB,
      vertexShader: VERTEX_SHADER,
      fragmentShader: getFragment("B"),
      depthWrite: false,
      depthTest: false,
    });

    const uniformsImage = {
      iResolution: { value: new THREE.Vector3(width, height, 1) },
      iTime: { value: 0 },
      iChannel0: { value: null },
      iChannel1: { value: rtA.texture },
    };

    const materialImage = new THREE.ShaderMaterial({
      uniforms: uniformsImage,
      vertexShader: VERTEX_SHADER,
      fragmentShader: getFragment("IMAGE"),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), materialA);
    scene.add(mesh);

    let rtBCurrent = rtB1;
    let rtBNext = rtB2;

    const resize = () => {
      const nextWidth = container.clientWidth || window.innerWidth;
      const nextHeight = container.clientHeight || window.innerHeight;

      renderer.setSize(nextWidth, nextHeight);
      rtA.setSize(nextWidth, nextHeight);
      rtB1.setSize(nextWidth, nextHeight);
      rtB2.setSize(nextWidth, nextHeight);

      uniformsA.iResolution.value.set(nextWidth, nextHeight, 1);
      uniformsB.iResolution.value.set(nextWidth, nextHeight, 1);
      uniformsImage.iResolution.value.set(nextWidth, nextHeight, 1);
    };

    const animate = () => {
      timerRef.current.update();
      const elapsed = timerRef.current.getElapsed();

      materialA.uniforms.iTime.value = elapsed;
      mesh.material = materialA;
      renderer.setRenderTarget(rtA);
      renderer.render(scene, camera);

      materialB.uniforms.iTime.value = elapsed;
      materialB.uniforms.iChannel0.value = rtBCurrent.texture;
      mesh.material = materialB;
      renderer.setRenderTarget(rtBNext);
      renderer.render(scene, camera);

      const temp = rtBCurrent;
      rtBCurrent = rtBNext;
      rtBNext = temp;

      materialImage.uniforms.iTime.value = elapsed;
      materialImage.uniforms.iChannel0.value = rtBCurrent.texture;
      mesh.material = materialImage;
      renderer.setRenderTarget(null);
      renderer.clear();
      materialA.uniforms.iOffsetX.value = 0.0;
      renderer.render(scene, camera);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", resize);
      mesh.geometry.dispose();
      materialA.dispose();
      materialB.dispose();
      materialImage.dispose();
      rtA.dispose();
      rtB1.dispose();
      rtB2.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}

export function PS2Background() {
  return (
    <div id="canvas-container" className="absolute inset-0 overflow-hidden">
      <WebGLOrbs2 />
    </div>
  );
}

export { PS2Background as default };

/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useWindowSize } from "@uidotdev/usehooks";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Position } from "types";

export const TorusBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const timerRef = useRef<THREE.Timer>(new THREE.Timer());
  const mousePositionRef = useRef<Position>({x: 0, y: 0});
  const [speed, setSpeed] = useState<number>(0.2);
  const [rotation, setRotation] = useState<number>(1);
  const windowHalfX = useRef(0);
  const windowHalfY = useRef(0);
  const size = useWindowSize();

  const normalMaterial = new THREE.MeshNormalMaterial({});
  const numTorus = 80;

  const torusMeshRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const r = new THREE.WebGLRenderer({antialias: true});
    const c = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 10000);
    const s = new THREE.Scene();

    s.add(c);

    rendererRef.current = r;
    cameraRef.current = c;
    sceneRef.current = s;

    const onWindowResize = () => {
      windowHalfX.current = window.innerWidth / 2;
      windowHalfY.current = window.innerHeight / 2;

      c.aspect = window.innerWidth / window.innerHeight;
      c.updateProjectionMatrix();

      r.setSize(window.innerWidth, window.innerHeight);
    };

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX - windowHalfX.current;
      const y = e.clientY - windowHalfY.current;
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const torus = (f: number) => {
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(160, 75, 2, 13), normalMaterial);
      mesh.position.x = 57 * Math.cos(f);
      mesh.position.y = 57 * Math.sin(f);
      mesh.position.z = f * 1.25;
      mesh.rotation.z = f * 0.03;
      return mesh;
    };

    const initializeWebGl = () => {
      if (!rendererRef.current) return;
      if (!sceneRef.current) return;
      if (!cameraRef.current) return;

      s.add(cameraRef.current);
      r.setSize(window.innerWidth, window.innerHeight);
      containerRef.current?.append(r.domElement);

      for (let i = 0; i < numTorus; i++) {
        const t = torus(-i * 13);
        torusMeshRef.current.push(t);
        sceneRef.current.add(t);
      }
    };

    function render() {
      if (!rendererRef.current) return;
      if (!sceneRef.current) return;
      if (!cameraRef.current) return;

      timerRef.current.update();
      const elapsed = timerRef.current.getElapsed();

      const { x: mouseX, y: mouseY } = mousePositionRef.current;

      // c.position.x += ( mouseX + c.position.x ) * .05;
      // c.position.y += ( mouseY + c.position.y ) * .05;

      r.render(s, c);

      for (let i = 0; i < numTorus; i++) {
        const mesh = torusMeshRef.current[i];
        if (!mesh) continue;
        mesh.position.z += speed;
        mesh.rotation.z += i * rotation / 10000;
        if (mesh.position.z > 0)
        {
          mesh.position.z = -1000;
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    }

    window.addEventListener("resize", onWindowResize, false);
    window.addEventListener("mousemove", onMouseMove, false);

    onWindowResize();

    initializeWebGl();
    render();

    return () => {
      window.removeEventListener("resize", onWindowResize, false);
      window.removeEventListener("mousemove", onMouseMove, false);
      // if (animationFrameRef.current !== null) {
      //   cancelAnimationFrame(animationFrameRef.current);
      // }
      // c.clear();
      // s.clear();
      // r.dispose();
    };
  }, [speed, rotation, size]);

  return (
    <div ref={containerRef} />
  );
};

export { TorusBackground as default };

"use client";

import React, { useMemo } from "react";
import { NextParticles } from "@tsparticles/nextjs";
import { type ISourceOptions } from "@tsparticles/engine";

export default function BootParticles() {
  const particlesOptions: ISourceOptions = useMemo(
    () => ({
      // background: {
      //   color: {
      //     value: "transparent",
      //   },
      // },
      fpsLimit: 60,
      //zIndex: -100,
      // fullScreen: {
      //   enable: true,
      //   zIndex: -100,
      // },
      name: "boot-particles",
      background: {
        opacity: 0,
      },
      particles: {
        number: {
          value: 20,
          density: { enable: false, value_area: 1104.8066982851817 },
        },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: {
          value: 11.83721462448409,
          random: true,
          anim: {
            enable: true,
            speed: 11.988011988011989,
            size_min: 0.1,
            sync: true,
          },
        },
        // zIndex: {
        //   value: 100,
        //   random: false,
        //   anim: { enable: false, speed: 1, zIndex_min: 0, sync: false },
        // },
        line_linked: {
          enable: false,
        },
        move: {
          enable: true,
          speed: 3.206824121731046,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: { enable: false, rotateX: 600, rotateY: 1200 },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: false, mode: "repulse" },
          onclick: { enable: false, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    }),
    [],
  );

  //return <NextParticles id="boot-particles" options={particlesOptions} className="absolute inset-0 opacity-100" />;
  return <></>;
}

"use client";

import React, { SVGProps, useEffect } from 'react';
import { useAudio, useBoot, useTheme } from '@context';
import Image from 'next/image';
import "./psp-boot.scss";

const PSP_BOOT_AUDIO_SRC = 'audio/psp/opening.mp3';

export function PspBoot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      id="psp-boot"
      overflow="hidden"
      preserveAspectRatio="none"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      {...props}
    >
      <style>
        {
          "@keyframes sce-text-kf{0%,to{opacity:0}40%,80%{opacity:1}}.line,path{stroke:#fff;opacity:0}"
        }
      </style>
      <defs id="defs3">
        <linearGradient id="bg-gradient" gradientTransform="rotate(90)">
          <stop id="stop1" offset="0%" stopColor="#000" />
          <stop id="stop2" offset="80%" stopColor="#000" />
          <stop id="stop3" offset="100%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path id="rect-bg-full" fill="#000" d="M0 0h600v400H0z" opacity={1}>
        <animate
          fill="freeze"
          attributeName="opacity"
          begin="5s"
          dur="1s"
          values="1; 0"
        />
      </path>
      <path
        id="rect3"
        fill="url(#bg-gradient)"
        d="M0 0h600v400H0z"
        style={{
          transformBox: "fill-box",
          transformOrigin: "0 0",
        }}
      >
        <animate
          fill="freeze"
          attributeName="opacity"
          begin="5s"
          dur="1s"
          values="1; 0"
        />
        <animateTransform
          fill="freeze"
          attributeName="transform"
          begin="2s"
          dur="4s"
          keyTimes="0; 1"
          type="translate"
          values="0 0; 0 -300"
        />
      </path>
      <text id="sce-text" x="300" y="100" textAnchor="middle" dominantBaseline="central" color="currentColor" fill="currentColor">
        <tspan>Sony Computer Entertainment</tspan>
      </text>
      <g id="g6">
        <rect
          id="rect4"
          width={600}
          height={0.5}
          x={0}
          y={99.75}
          fill="#fff"
          rx={0.5}
        >
          <animate
            fill="freeze"
            attributeName="opacity"
            begin="1.5s"
            dur="2.5s"
            keyTimes="0; 0.27; 0.85; 1"
            values="0; 0.1; 0.18; 0"
          />
          <animateTransform
            fill="freeze"
            attributeName="transform"
            begin="1.1s"
            dur="2.9s"
            from="0 8"
            to="330 8"
            type="translate"
          />
        </rect>
        <rect
          id="rect5"
          width={120}
          height={0.7}
          x={0}
          y={99.65}
          fill="#fff"
          rx={0.7}
        >
          <animate
            fill="freeze"
            attributeName="opacity"
            begin="1.9s"
            dur="2.1s"
            keyTimes="0; 0.25; 0.9; 1"
            values="0; 0.2; 0.27; 0"
          />
          <animateTransform
            fill="freeze"
            attributeName="transform"
            begin="1.9s"
            dur="2.1s"
            from="0 -15"
            to="-120 -15"
            type="translate"
          />
        </rect>
        <rect
          id="rect6"
          width={200}
          height={0.7}
          x={450}
          y={99.65}
          fill="#fff"
          rx={0.7}
        >
          <animate
            fill="freeze"
            attributeName="opacity"
            begin="2s"
            dur="2.1s"
            keyTimes="0; 0.25; 0.9; 1"
            values="0; 0.2; 0.27; 0"
          />
          <animateTransform
            fill="freeze"
            attributeName="transform"
            begin="2s"
            dur="2.1s"
            from="0 5"
            to="200 5"
            type="translate"
          />
        </rect>
        <rect
          id="rect7"
          width={220}
          height={0.3}
          x={65}
          y={99.85}
          fill="#fff"
          rx={0.3}
        >
          <animate
            fill="freeze"
            attributeName="opacity"
            begin="1.2s"
            dur="2.8s"
            keyTimes="0; 0.27; 0.85; 1"
            values="0; 0.3; 0.18; 0"
          />
          <animateTransform
            fill="freeze"
            attributeName="transform"
            begin="1.2s"
            dur="2.8s"
            from="0 10"
            to="-110 10"
            type="translate"
          />
        </rect>
        <rect
          id="rect8"
          width={300}
          height={1.341}
          x={390}
          y={99}
          fill="#fff"
          rx={2}
          style={{
            strokeWidth: 0.818799,
          }}
        >
          <animate
            fill="freeze"
            attributeName="opacity"
            begin="1.2s"
            dur="2.8s"
            keyTimes="0; 0.27; 0.85; 1"
            values="0; 0.2; 0.25; 0"
          />
          <animateTransform
            fill="freeze"
            attributeName="transform"
            begin="1.2s"
            dur="2.8s"
            from="0 -2"
            to="180 -2"
            type="translate"
          />
        </rect>
        <rect
          id="rect9"
          width={210.201}
          height={1}
          x={150}
          y={99.5}
          fill="#fff"
          rx={1.401}
          style={{
            strokeWidth: 1.18378,
          }}
        >
          <animate
            fill="freeze"
            attributeName="opacity"
            begin="1.5s"
            dur="2.5s"
            keyTimes="0; 0.19; 0.85; 1"
            values="0; 0.3; 0.22; 0"
          />
          <animateTransform
            fill="freeze"
            attributeName="transform"
            begin="1.5s"
            dur="2.5s"
            from="150 0"
            to="-105 0"
            type="translate"
          />
        </rect>
      </g>
    </svg>
  );
}

export function PspBootView() {

  const { isBootVisible } = useBoot();
  const { boot } = useTheme();
  const { play } = useAudio();

  useEffect(() => {
    void play(PSP_BOOT_AUDIO_SRC);
  }, []);

  return isBootVisible && boot && (
    (
      <React.Fragment>
        <div className="boot-psp absolute left-0 top-0 w-full h-full text-white">
          <PspBoot className="text-white w-full h-full object-fill" />
        </div>
      </React.Fragment>
    )
  );
}

export { PspBootView as default };

"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Fireworks } from '@fireworks-js/react';
import type { FireworksHandlers } from '@fireworks-js/react';
import { useDoubleTap } from "@hooks";
import { useBoot } from "@context";
import "./brix-boot.scss";

export function BrixBoot() {

  const ref = useRef<FireworksHandlers>(null);
  const { hideBootScreen } = useBoot();

  useDoubleTap({
    onDoubleTap: hideBootScreen,
  });

  return (
    <div className="brix-boot w-screen h-screen absolute flex">
      <Fireworks
        ref={ref}
        className="brix-boot-fireworks"
        options={{
          autoresize: true,
          opacity: 0.2,
          acceleration: 1.02,
          friction: 0.99,
          gravity: 5.0,
          particles: 120,
          traceLength: 2,
          traceSpeed: 0.5,
          explosion: 8,
          intensity: 40,
          flickering: 90, // 50
          lineStyle: 'round',
          hue: {
            min: 0,
            max: 345,
          },
          decay: {
            min: 0.015,
            max: 0.056,
          },
          delay: {
            min: 15,
            max: 75,
          },
          rocketsPoint: {
            min: 40,
            max: 60,
          },
          lineWidth: {
            explosion: {
              min: 2,
              max: 5,
            },
            trace: {
              min: 0.2,
              max: 2.0,
            },
          },
          brightness: {
            min: 50,
            max: 80,
          },
          mouse: {
            click: true,
            move: false,
            max: 3,
          }}}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          position: 'fixed',
          zIndex: 0,
        }}
      />
      <div className="grid w-screen h-screen absolute z-100 place-content-end place-items-end">
        <Image src={'svg/brix.svg'} alt="couple" fill className="brix-boot-fg place-self-end" loading="eager" />
      </div>
    </div>
  );
}

export { BrixBoot as default };

"use client";

import React from "react";
import Background from '@components/background/background';
import dynamic from "next/dynamic";
import Secret from '@components/secret/Secret';
import { useBoot } from '@context/BootContext';
import { NextParticlesProvider } from "@tsparticles/nextjs";
import type { Engine } from "@tsparticles/engine";

const Clock = dynamic(() => import('@components/clock/Clock'), { ssr: false });
const Menu = dynamic(() => import('@components/xmb-menu/xmb-menu'), { ssr: false });
const Modal = dynamic(() => import('@components/modal/Modal'), { ssr: false });

const init = async (engine: Engine): Promise<void> => {
  const [{ loadSlim }, { loadThemesPlugin }] = await Promise.all([
    import("@tsparticles/slim"),
    import("@tsparticles/plugin-themes"),
  ]);

  await Promise.all([loadSlim(engine), loadThemesPlugin(engine)]);
};

export default function Home() {
  const { isBootVisible, isBootTransitioningOut } = useBoot();

  return (
    <NextParticlesProvider init={init}>
      <div className="root-container">
        <Background />
        {!isBootVisible && !isBootTransitioningOut && (
          <>
            <Secret />
            <Clock />
            <Menu />
            <Modal />
          </>
        )}
      </div>
    </NextParticlesProvider>
  );
}

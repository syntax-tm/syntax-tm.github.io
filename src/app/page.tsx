"use client";

import React from "react";
import Background from '@components/background/background';
import { useBoot } from '@context/BootContext';
import Clock from "@components/clock/Clock";
import Menu from "@components/xmb-menu/xmb-menu";
import Modal from "@components/modal/Modal";
import WebGlBackground from "@components/background/webGlBackground";
import BackgroundView from "@components/background/BackgroundView";

export default function Home() {
  const { isBootVisible, isBootTransitioningOut } = useBoot();

  return (
    <div className="root-container">
      <BackgroundView />
      {!isBootVisible && !isBootTransitioningOut && (
        <>
          <Clock />
          <Menu />
          <Modal />
        </>
      )}
    </div>
  );
}

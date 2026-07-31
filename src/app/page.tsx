"use client";

import React from "react";
import { useBoot } from '@context/BootContext';
import Clock from "@components/clock/clock";
import Menu from "@components/xmb-menu/xmb-menu";
import BackgroundView from "@components/background/background-view";

export default function Home() {
  const { isBootVisible, isBootTransitioningOut } = useBoot();

  return (
    <div className="root-container">
      <BackgroundView />
      {!isBootVisible && !isBootTransitioningOut && (
        <>
          <Clock />
          <Menu />
        </>
      )}
    </div>
  );
}

"use client";

import React from "react";
import Background from '@components/background/background';
import { useBoot } from '@context/BootContext';
import Clock from "@components/clock/Clock";
import Menu from "@components/xmb-menu/xmb-menu";
import Modal from "@components/modal/Modal";

export default function Home() {
  const { isBootVisible, isBootTransitioningOut } = useBoot();

  return (
    <div className="root-container">
      <Background />
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

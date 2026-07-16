"use client";

import React from "react";
import Background from '@components/background/background';
import dynamic from "next/dynamic";
//import Modal from "@/components/modal/Modal";
import Secret from '@components/secret/Secret';

const Clock = dynamic(() => import('@components/clock/Clock'), { ssr: false });
const Menu = dynamic(() => import('@components/xmb-menu/xmb-menu'), { ssr: false });
const Modal = dynamic(() => import('@components/modal/Modal'), { ssr: false });

export default function Home() {

  return (
    <div className="root-container">
      <Background />
      <Secret />
      <Clock />
      <Menu />
      <Modal />
    </div>
  );
}

"use client"

import Image from "next/image";
import Background from '@components/background/background';
import dynamic from "next/dynamic";
import { useRef, useState, ReactNode, useEffect, Dispatch, SetStateAction, CSSProperties } from "react";
//import Modal from "@/components/modal/Modal";

const Clock = dynamic(() => import('@components/clock/Clock'), { ssr: false });
const Menu = dynamic(() => import('@components/xmb-menu/xmb-menu'), { ssr: false });
const Modal = dynamic(() => import('@components/modal/Modal'), { ssr: false })

export default function Home() {

  return (
    <>
      <Background />
      <Clock />
      <Menu />
      <Modal />
    </>
  );
}

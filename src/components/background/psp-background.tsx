"use client";

import React from 'react';
import PspBackgroundImage from "svg/psp-background.svg";
import Image from 'next/image';
import './psp-background.scss';

export function PspBackground() {

  return (
    <div className={`background psp-background absolute top-0 left-0 overflow-hidden h-dvh -z-50`}>
      <Image src={PspBackgroundImage} alt="psp background image" className="h-full w-full" />
    </div>
  );
};

export { PspBackground as default };

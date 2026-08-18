"use client";

import React from 'react';
import Image from 'next/image';

export function PspBackground() {

  return (
    <div className={`background psp-background absolute top-0 left-0 overflow-hidden h-dvh -z-50`}>
      <Image src={'svg/psp-background.svg'} alt="psp background image" className="h-full w-full" />
    </div>
  );
};

export { PspBackground as default };

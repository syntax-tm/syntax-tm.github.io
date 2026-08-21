"use client";

import React from 'react';
import Image from 'next/image';

export function PspBackground() {

  return (
    <div className={`background psp-background overflow-hidden h-dvh -z-50 relative`}>
      <Image src={'svg/psp-background.svg'} alt="psp background image" fill className="h-full w-full" style={{ objectFit: 'cover' }} />
    </div>
  );
};

export { PspBackground as default };

"use client";

import React, { useEffect } from 'react';
import { useAudio, useBoot, useTheme } from '@context';
import Image from 'next/image';
import "./psp-boot.scss";

const PSP_BOOT_AUDIO_SRC = 'audio/psp/opening.mp3';

export function PspBoot() {

  const { isBootVisible } = useBoot();
  const { boot } = useTheme();
  const { play } = useAudio();

  useEffect(() => {
    void play(PSP_BOOT_AUDIO_SRC);
  }, []);

  return isBootVisible && boot && (
    (
      <React.Fragment>
        <div className="boot-psp relative">
          <Image src={'svg/psp_boot.svg'} alt="psp boot" fill className='psp-boot-image h-full w-full z-100 absolute left-0 top-0' style={{ objectFit: 'cover' }} loading='eager' />
        </div>
      </React.Fragment>
    )
  );
}

export { PspBoot as default };

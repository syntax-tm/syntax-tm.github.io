'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSecret } from '@context/SecretContext';
import PixelatedBackground from '@components/background/PixelatedBackground';
import WebGlBackground from '@components/background/webGlBackground';

export default function BackgroundView() {

  const { isMissingNoSecretActive } = useSecret();

  return (
    <>
      {isMissingNoSecretActive
        ? <PixelatedBackground />
        : <WebGlBackground />}
    </>
  );

}
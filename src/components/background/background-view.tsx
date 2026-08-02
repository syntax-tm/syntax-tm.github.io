'use client';

import React, { useEffect, useState } from 'react';
import { useSecret } from '@context/SecretContext';
import SecretBackground from '@components/background/secret-background';
import WebGlBackground from '@components/background/webgl-background';

export default function BackgroundView() {

  // if konami, missingno, android, oceangate, or 404 secrets are active, use the SecretBackground,
  // otherwise default to WebGlBackground
  const { getBackground } = useSecret();

  const bg = getBackground();
  const isSecretBg = bg !== null;

  return (
    <>
      {isSecretBg
        ? <SecretBackground />
        : <WebGlBackground />}
    </>
  );

}

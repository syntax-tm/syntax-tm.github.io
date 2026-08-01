'use client';

import React, { useEffect, useState } from 'react';
import { useSecret } from '@context/SecretContext';
import SecretBackground from '@components/background/secret-background';
import WebGlBackground from '@components/background/webgl-background';

export default function BackgroundView() {

  const [isSecretBg, setIsSecretBg] = useState(false);

  // if konami, missingno, or 404 secrets are active, use the PixelatedBackground
  // otherwise default to WebGlBackground
  const { isKonamiSecretActive, isMissingNoSecretActive, is404SecretActive, isOceangateSecretActive } = useSecret();

  useEffect(() => {
    const secretBg = isKonamiSecretActive || isMissingNoSecretActive || is404SecretActive || isOceangateSecretActive;
    setIsSecretBg(secretBg);
  }, [isKonamiSecretActive, isMissingNoSecretActive, is404SecretActive, isOceangateSecretActive]);

  return (
    <>
      {isSecretBg
        ? <SecretBackground />
        : <WebGlBackground />}
    </>
  );

}

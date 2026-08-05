'use client';

import React, { useEffect, useState } from 'react';
import { useSecret } from '@context/SecretContext';
import SecretBackground from '@components/background/secret-background';
import WebGlBackground from '@components/background/webgl-background';

export default function BackgroundView() {
  // if any background secret is active, use the secret shader; otherwise use the default WebGL background.
  const { isBackgroundActive, settings } = useSecret();
  const [isSecretBg, setIsSecretBg] = useState(false);

  useEffect(() => {

    const isActive = isBackgroundActive();
    setIsSecretBg(isActive);

  }, [settings]);

  return isSecretBg ? <SecretBackground /> : <WebGlBackground />;
}

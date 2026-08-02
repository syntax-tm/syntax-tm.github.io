'use client';

import React from 'react';
import { useSecret } from '@context/SecretContext';
import SecretBackground from '@components/background/secret-background';
import WebGlBackground from '@components/background/webgl-background';

export default function BackgroundView() {
  // if any background secret is active, use the secret shader; otherwise use the default WebGL background.
  const { getBackground } = useSecret();
  const isSecretBg = getBackground() !== null;

  return isSecretBg ? <SecretBackground /> : <WebGlBackground />;
}

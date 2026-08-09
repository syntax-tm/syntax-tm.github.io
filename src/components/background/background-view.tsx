'use client';

import React, { useEffect, useState } from 'react';
import WebGlBackground from './webgl-background';
import { useTheme } from '@context/ThemeContext';

const DEFAULT_BACKGROUND = <WebGlBackground />;

export default function BackgroundView() {
  // if any background secret is active, use the secret shader; otherwise use the default WebGL background.
  const { currentTheme } = useTheme();

  const background = currentTheme?.background ?? DEFAULT_BACKGROUND;

  return (
    <div className={`background-container -z-100`}>
      {background}
    </div>
  );
}

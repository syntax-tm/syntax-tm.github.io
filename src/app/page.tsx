"use client";

import React from "react";
import { useBoot } from '@context/BootContext';
import { useTheme } from "@context/ThemeContext";
import { Menu } from "@components/xmb-menu/xmb-menu";
import { BackgroundView } from "@components/background/background-view";
import { BootView } from "@components/boot/";

export default function Home() {
  const { isBootVisible } = useBoot();
  const { currentTheme, font } = useTheme();

  const themeClassName = currentTheme ? currentTheme.className : 'default-theme';
  const fontClassName = font ? font.className : 'default-font';
  const clock = currentTheme?.clock;

  return (
    <div className={`root-container ${themeClassName} ${fontClassName}`}>
      {
        isBootVisible
          ?
          <>
            <BootView />
          </>
          :
          <>
            <BackgroundView />
            {clock}
            <Menu />
          </>
      }
    </div>
  );
}

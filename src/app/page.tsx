"use client";

import React from "react";
import { useBoot } from '@context/BootContext';
import { useTheme } from "@context/ThemeContext";
import Menu from "@components/xmb-menu/xmb-menu";
import BackgroundView from "@components/background/background-view";
import Boot from "@components/boot/boot";

export default function Home() {
  const { isBootVisible } = useBoot();
  const { currentTheme, font, boot } = useTheme();

  const themeClassName = currentTheme ? currentTheme.className : 'default-theme';
  const fontClassName = font ? font.className : 'default-font';
  const clock = currentTheme?.clock;
  const bootView = boot?.element ?? <Boot />;

  return (
    <div className={`root-container ${themeClassName} ${fontClassName}`}>
      <BackgroundView />
      {
        isBootVisible
          ? bootView
          :
          <>
            {clock}
            <Menu />
          </>
      }
    </div>
  );
}

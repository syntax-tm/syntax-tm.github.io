"use client";

import React from "react";
import ClockView from "@components/clock/clock-view";
import Menu from "@components/xmb-menu/xmb-menu";
import BackgroundView from "@components/background/background-view";
import { useTheme } from "@context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentTheme, font } = useTheme();

  const themeClassName = currentTheme ? currentTheme.className : 'default-theme';
  const fontClassName = font ? font.className : 'default-font';

  return (
    <div className={`root-container ${themeClassName} ${fontClassName}`}>
      <BackgroundView />
      <ClockView />
      <Menu />
      {children}
    </div>
  );
}

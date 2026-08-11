import { AchievementId } from '@enums';
import type { NextFont, NextFontWithVariable } from 'next/dist/compiled/@next/font';
import localFont from "next/font/local";

export const pspFont: NextFontWithVariable = localFont({
  src: '../../public/fonts/FOT-NewRodin Pro L.otf',
  variable: '---newrodin-pro',
  style: 'normal',
  weight: '400',
  preload: true,
  fallback: ["Segoe UI Variable Text"],
});

export const dreamcastFont: NextFontWithVariable = localFont({
  src: '../../public/fonts/NiseSegaDreamcast.ttf',
  variable: '---nise-sega-dreamcast',
  style: 'normal',
  weight: '400',
  preload: true,
  fallback: ["Segoe UI Variable Text"],
});

export interface FontConfig {
  font: NextFont;
  className: string | undefined;
}

export const fontMap = new Map<AchievementId, FontConfig>([
  ["PSP_CODE", { font: pspFont, className: pspFont.className }],
  ["DREAMCAST", { font: dreamcastFont, className: dreamcastFont.className }],
]);

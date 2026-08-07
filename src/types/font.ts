import { AchievementId } from '@enums';
import type { NextFont, NextFontWithVariable } from 'next/dist/compiled/@next/font';
import localFont from "next/font/local";

const PSP_FONT_VARIABLE = '---newrodin-pro';
const DREAMCAST_FONT_VARIABLE = '---nise-sega-dreamcast';

export const pspFont: NextFontWithVariable = localFont({
  src: '../../public/fonts/FOT-NewRodin Pro L.otf',
  variable: '---newrodin-pro',
  style: 'normal',
  weight: '400',
  preload: true,
});

export const dreamcastFont: NextFontWithVariable = localFont({
  src: '../../public/fonts/NiseSegaDreamcast.ttf',
  variable: '---nise-sega-dreamcast',
  style: 'normal',
  weight: '400',
  preload: true,
});

export interface FontConfig {
  font: NextFont;
  className: string | undefined;
}

export const fontMap = new Map<AchievementId, FontConfig>([
  ["PSP_CODE", { font: pspFont, className: PSP_FONT_VARIABLE }],
  ["DREAMCAST", { font: dreamcastFont, className: DREAMCAST_FONT_VARIABLE }],
]);

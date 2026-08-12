import { AchievementId } from '@enums';
import type { NextFont, NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Google_Sans, Play } from 'next/font/google';
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

export const ps2Font = Play({
  weight: ["400", "700"],
  preload: true,
  subsets: ['latin'],
  fallback: ['Segoe UI', 'sans'],
  adjustFontFallback: false,
});

export const DEFAULT_NEXT_FONT = Google_Sans({
  weight: ["400", "500", "600"],
  preload: true,
  subsets: ['latin'],
  fallback: ['Segoe UI', 'sans'],
  adjustFontFallback: false,
});

export interface FontConfig {
  font: NextFont;
  className: string | undefined;
}

export const DEFAULT_FONT: FontConfig = {
  className: DEFAULT_NEXT_FONT.className,
  font: DEFAULT_NEXT_FONT,
};

export const fontMap = new Map<AchievementId, FontConfig>([
  ["PSP_CODE", { font: pspFont, className: pspFont.className }],
  ["DREAMCAST", { font: dreamcastFont, className: dreamcastFont.className }],
  ["_404", DEFAULT_FONT],
  ["IWHBYD", DEFAULT_FONT],
  ["KONAMI_CODE", DEFAULT_FONT],
  ["OCEANGATE", DEFAULT_FONT],
  ["MISSING_NO", DEFAULT_FONT],
  ["ANDROID", ps2Font],
]);

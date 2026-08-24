import { AchievementId } from '@enums';
import type { NextFont, NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Google_Sans, Mansalva } from 'next/font/google';
import localFont from "next/font/local";

export const pspFont: NextFontWithVariable = localFont({
  src: '../../public/fonts/NewRodinPro-L-AlphaNum.woff2',
  variable: '--font-newrodin-pro-l',
  style: 'normal',
  weight: '400',
  preload: true,
  fallback: ["Segoe UI Variable Text", "Segoe UI"],
});

export const dreamcastFont: NextFontWithVariable = localFont({
  src: '../../public/fonts/Dreamcast.woff2',
  variable: '--font-nise-sega-dreamcast',
  style: 'normal',
  weight: '400',
  preload: true,
  fallback: ["Segoe UI Variable Text", "Segoe UI"],
});

export const exocetFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../../public/fonts/ExocetLight.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ExocetHeavy.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-exocet',
  style: 'normal',
  weight: '400',
  preload: true,
  fallback: ["Segoe UI Variable Text"],
});

export const ps2Font: NextFontWithVariable = localFont({
  src: [
    {
      path: '../../public/fonts/EmotionEngine.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/EmotionEngine-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/EmotionEngine-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/EmotionEngine-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-emotional-engine',
  style: 'normal',
  weight: '400',
  preload: true,
  fallback: ["Segoe UI Variable Text"],
});

export const ps2BiosFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../../public/fonts/ps2-bios-font.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-ps2-bios',
  style: 'normal',
  weight: '400',
  preload: true,
  fallback: ["Segoe UI Variable Text"],
});

export const SECRET_INPUT_FONT = exocetFont;

// export const SECRET_INPUT_FONT = Slackside_One({
//   weight: "400",
//   preload: true,
//   fallback: ['Courier New', 'monospace'],
//   subsets: ['latin'],
// });

export const DEFAULT_NEXT_FONT = Google_Sans({
  weight: ["400", "500", "600"],
  preload: true,
  subsets: ['latin'],
  fallback: ['Segoe UI', 'sans'],
  variable: '--font-google-sans',
  adjustFontFallback: false,
});

// export const BRIX_FONT = Oooh_Baby({
//   weight: '400',
//   preload: true,
//   fallback: ['Brush Script MT', 'cursive'],
// });

export const BRIX_FONT = Mansalva({
  weight: '400',
  preload: true,
  fallback: ['Brush Script MT', 'cursive'],
  variable: '--font-brush-script-mt',
  subsets: ['latin'],
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
  ["PSP", { font: pspFont, className: pspFont.className }],
  ["DREAMCAST", { font: dreamcastFont, className: dreamcastFont.className }],
  ["_404", DEFAULT_FONT],
  ["IWHBYD", DEFAULT_FONT],
  ["KONAMI_CODE", DEFAULT_FONT],
  ["OCEANGATE", DEFAULT_FONT],
  ["MISSING_NO", DEFAULT_FONT],
  ["ANDROID", DEFAULT_FONT],
  ["BRIX", { font: BRIX_FONT, className: BRIX_FONT.className }],
  ["PS2", { font: ps2BiosFont, className: ps2BiosFont.className }],
]);

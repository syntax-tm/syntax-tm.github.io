import { AchievementId } from '@enums';
import type { NextFont, NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Google_Sans, Play, DotGothic16, Silkscreen, Oooh_Baby, Mansalva, Sue_Ellen_Francisco, Press_Start_2P, Redacted_Script, VT323, Slackside_One } from 'next/font/google';
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

export const exocetFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../../public/fonts/films.EXL_____.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/films.EXH_____.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '---exocet-light',
  style: 'normal',
  weight: '400',
  preload: true,
  fallback: ["Segoe UI Variable Text"],
});

export const ps2Font: NextFontWithVariable = localFont({
  src: [
    {
      path: '../../public/fonts/Emotion Engine.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Emotion Engine Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Emotion Engine Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Emotion Engine Bold Italic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '---emotional-engine',
  style: 'normal',
  weight: '400',
  preload: true,
  fallback: ["Segoe UI Variable Text"],
});

export const ps2BiosFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../../public/fonts/ps2-bios-font.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '---ps2-bios-font',
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
  ["PSP_CODE", { font: pspFont, className: pspFont.className }],
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

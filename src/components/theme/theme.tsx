import React from "react";
import { AchievementId } from "@enums";
import { FontConfig, fontMap, secrets } from "types";
import DreamcastBackground from "@components/background/dreamcast-background";
import DreamcastBoot from "@components/boot/dreamcast";
import SecretBackground from "@components/background/secret-background";
import Boot from "@components/boot/boot";
import { SecretClass, getSecretClass } from "@enums/secret-class";
import { Google_Sans } from "next/font/google";

export interface ThemeConfig {
  id: AchievementId;
  className: SecretClass;
  background: React.ReactNode;
  boot?: BootConfig;
  font?: FontConfig;
}

export interface BootConfig {
  element: React.ReactNode;
  bootDuration: number;
  bootFadeInDuration?: number;
  bootFadeOutDuration?: number;
}

const DEFAULT_NEXT_FONT = Google_Sans({
  weight: ["400", "500", "600"],
  preload: true,
  subsets: ['latin'],
  fallback: ['Segoe UI', 'sans'],
});

const DEFAULT_FONT: FontConfig = {
  className: DEFAULT_NEXT_FONT.className,
  font: DEFAULT_NEXT_FONT,
};

const DEFAULT_BOOT: BootConfig = {
  element: <Boot />,
  bootDuration: 5000,
  bootFadeOutDuration: 600,
};
const DEFAULT_BACKGROUND = <SecretBackground />;

const bootMap = new Map<AchievementId, BootConfig>();
bootMap.set("DREAMCAST", { element: <DreamcastBoot />, bootDuration: 5000 });

const bgMap = new Map<AchievementId, React.ReactNode>();
bgMap.set("DREAMCAST", <DreamcastBackground />);

function createTheme(id: AchievementId): ThemeConfig {
  const background = bgMap.get(id) ?? DEFAULT_BACKGROUND;
  const boot = bootMap.get(id) ?? DEFAULT_BOOT;
  const font = fontMap.get(id) ?? DEFAULT_FONT;

  return {
    id,
    className: getSecretClass(id),
    background,
    boot,
    font,
  };
}

export const themes = new Map<AchievementId, ThemeConfig>();

secrets.forEach((s) => {
  const id = s.id;
  const theme = createTheme(id);

  themes.set(id, theme);
});

export const getTheme = (id: AchievementId) => {
  return themes.get(id);
};

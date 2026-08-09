import React from "react";
import { AchievementId } from "@enums";
import { FontConfig, fontMap, secrets, StatDefinition } from "types";
import { SecretClass, getSecretClass } from "@enums/secret-class";
import { Google_Sans } from "next/font/google";
import componentMap from "@components/component-map/component-map";

export interface ThemeConfig {
  id: AchievementId;
  className: SecretClass;
  background: React.ReactNode;
  boot: BootConfig;
  clock: React.ReactNode;
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

const DEFAULT_BACKGROUND = 'webgl-background';
const DEFAULT_CLOCK = 'clock';
const DEFAULT_BOOT = 'boot';
const DEFAULT_BOOT_DURATION = 5000;
const DEFAULT_BOOT_FADE_OUT = 600;

function createTheme(stat: StatDefinition): ThemeConfig {

  const id = stat.id;
  const bg = stat.theme?.background ?? DEFAULT_BACKGROUND;
  const background = componentMap.get(bg);
  const ck = stat.theme?.clock ?? DEFAULT_CLOCK;
  const clock = componentMap.get(ck);

  let bootComponent;
  let bootDuration = DEFAULT_BOOT_DURATION;
  let bootFadeInDuration = 0;
  let bootFadeOutDuration = DEFAULT_BOOT_FADE_OUT;

  if (stat.theme) {
    if (typeof stat.theme.boot === "string") {
      bootComponent = componentMap.get(stat.theme.boot);
    }
    else if (typeof stat.theme.boot === "undefined") {
      bootComponent = componentMap.get(DEFAULT_BOOT);
    }
    else {
      const bootComponentName = stat.theme.boot.component;
      bootComponent = componentMap.get(bootComponentName);
      bootDuration = stat.theme.boot.bootDuration ?? DEFAULT_BOOT_DURATION;
      bootFadeInDuration = stat.theme.boot.bootFadeInDuration ?? 0;
      bootFadeOutDuration = stat.theme.boot.bootFadeOutDuration ?? DEFAULT_BOOT_FADE_OUT;
    }
  }
  else {
    bootComponent = componentMap.get(DEFAULT_BOOT);
    bootDuration = DEFAULT_BOOT_DURATION;
    bootFadeOutDuration = DEFAULT_BOOT_FADE_OUT;
  }

  const boot: BootConfig = {
    element: bootComponent,
    bootDuration,
    bootFadeInDuration,
    bootFadeOutDuration,
  };
  const font = fontMap.get(id) ?? DEFAULT_FONT;

  return {
    id,
    className: getSecretClass(id),
    background,
    boot,
    clock,
    font,
  };
}

export const themes = new Map<AchievementId, ThemeConfig>();

secrets.forEach((s) => {
  const id = s.id;
  const theme = createTheme(s);

  themes.set(id, theme);
});

export const getTheme = (id: AchievementId) => {
  return themes.get(id);
};

"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AchievementId, DEFAULT_FONT, FontConfig, fontMap, secrets, StatDefinition, ThemeChangeEventDetail } from "types";
import { useSettings } from "@stores";
import { getSecretClass, SecretClass } from "@enums/secret-class";
import componentMap from "@components/component-map/component-map";
import { useSecret } from "./SecretContext";

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
  showBackground: boolean;
}

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
  let showBackground = false;

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
      showBackground = stat.theme.boot.showBackground ?? false;
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
    showBackground: showBackground ?? false,
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

interface ThemeContextType {
  isThemeApplied: boolean;
  currentTheme: ThemeConfig | null;
  font: FontConfig | null;
  boot: BootConfig | null;
  clock: React.ReactNode | null;
  className: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {

  const [currentSetting, setCurrentSetting] = useState<AchievementId | null>(null);
  const { id, update } = useSettings((state) => state);
  const [themes] = useState<Map<AchievementId, ThemeConfig> | null>(() => {
    const t = new Map<AchievementId, ThemeConfig>();

    secrets.forEach((s) => {
      const id = s.id;
      const theme = createTheme(s);

      t.set(id, theme);
    });

    return t;
  });

  const getTheme = (id: AchievementId | undefined | null): ThemeConfig | undefined => {
    if (!themes) return undefined;
    if (!id) return themes.get('UNKNOWN');
    return themes.get(id);
  };

  const [currentTheme, setCurrentTheme] = useState<ThemeConfig | undefined>(() => {
    return getTheme(id);
  });

  useEffect(() => {
    const theme = getTheme(id || undefined);
    setCurrentTheme(theme);
    setCurrentSetting(id);
  }, [id, themes]);

  useEffect(() => {

    const handleThemeChanged = (e: CustomEvent<ThemeChangeEventDetail>) => {
      const newId = e.detail.id;

      console.log(`Theme changed to '${newId}' from '${id}.`);

      update(newId);

      setCurrentSetting(newId);
      const theme = newId ? getTheme(newId) : undefined;
      setCurrentTheme(theme);
    };

    window.addEventListener('themeChange', handleThemeChanged);

    return () => {
      window.removeEventListener('themeChange', handleThemeChanged);
    };
  }, [id]);

  const value = useMemo(() => {
    return {
      isThemeApplied: currentTheme != undefined,
      currentTheme: currentTheme ?? null,
      font: currentTheme?.font ?? null,
      boot: currentTheme?.boot ?? null,
      clock: currentTheme?.clock,
      className: currentTheme?.className ?? null,
    };
  }, [currentTheme, id]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

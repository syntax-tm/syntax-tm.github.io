"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { BootConfig, ThemeConfig  } from "@components/theme/theme";
import { AchievementId, FontConfig, ThemeChangeEventDetail } from "types";
import { getTheme } from "@components/theme/theme";
import { useSettings, useSettingStore } from "@stores";

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
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig | undefined>(undefined);
  const [currentSetting, setCurrentSetting] = useState<AchievementId | null>(null);
  const { id, update } = useSettings((state) => state);

  useEffect(() => {
    const theme = id ? getTheme(id) : undefined;
    setCurrentTheme(theme);
    setCurrentSetting(id);
  }, [id]);

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

  const value = {
    isThemeApplied: currentTheme != null,
    currentTheme: currentTheme ?? null,
    font: currentTheme?.font ?? null,
    boot: currentTheme?.boot ?? null,
    clock: currentTheme?.clock,
    className: currentTheme?.className ?? null,
  };

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

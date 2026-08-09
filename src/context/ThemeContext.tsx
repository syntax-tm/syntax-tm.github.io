"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { BootConfig, ThemeConfig  } from "@components/theme/theme";
import { useSecret } from "./SecretContext";
import { FontConfig } from "types";
import { getTheme } from "@components/theme/theme";

interface ThemeContextType {
  isThemeApplied: boolean;
  currentTheme: ThemeConfig | null;
  font: FontConfig | null;
  boot: BootConfig | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig | undefined>(undefined);
  const { currentSecret } = useSecret();

  useEffect(() => {
    const theme = currentSecret ? getTheme(currentSecret) : undefined;
    setCurrentTheme(theme);
  }, [currentSecret]);

  const value = {
    isThemeApplied: currentTheme != null,
    currentTheme: currentTheme ?? null,
    font: currentTheme?.font ?? null,
    boot: currentTheme?.boot ?? null,
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

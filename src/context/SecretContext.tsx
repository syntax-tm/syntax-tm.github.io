"use client";

import React, { createContext, useCallback, useContext, useEffect } from "react";
import { useKeySequence } from "@hooks/useKeySequence";
import { AchievementId } from "@enums";
import { secrets, secretGroups, ThemeChangeEventDetail } from "types";
import { SettingStore, useSettingStore } from "@stores/setting-store";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];
const PSP = [
  "p", "s", "p",
];
const IWHBYD_CODE = [
  "i", "w", "h",
  "b", "y", "d",
];

export interface SecretContextType {
  _404Store: SettingStore;
  androidStore: SettingStore;
  dreamcastStore: SettingStore;
  iwhbydStore: SettingStore;
  konamiCodeStore: SettingStore;
  missingNoStore: SettingStore;
  oceangateStore: SettingStore;
  pspCodeStore: SettingStore;
}

const SecretContext = createContext<SecretContextType | undefined>(undefined);

export function SecretProvider({ children }: { children: React.ReactNode }) {

  const _404Store = useSettingStore("_404", (state) => state);
  const androidStore = useSettingStore("ANDROID", (state) => state);
  const dreamcastStore = useSettingStore("DREAMCAST", (state) => state);
  const iwhbydStore = useSettingStore("IWHBYD", (state) => state);
  const konamiCodeStore = useSettingStore("KONAMI_CODE", (state) => state);
  const missingNoStore = useSettingStore("MISSING_NO", (state) => state);
  const oceangateStore = useSettingStore("OCEANGATE", (state) => state);
  const pspCodeStore = useSettingStore("PSP_CODE", (state) => state);

  const getSecret = useCallback((id: AchievementId) => {
    const results = secrets.filter(s => s.id === id);
    return results[0];
  }, [secrets]);

  useKeySequence(KONAMI_CODE, () => {
    konamiCodeStore.unlock();
  });

  useKeySequence(PSP, () => {
    pspCodeStore.unlock();
  });

  useKeySequence(IWHBYD_CODE, () => {
    iwhbydStore.unlock();
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleGamepadConnected = () => {
      oceangateStore.unlock();
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
    };
  }, [oceangateStore]);

  const value = {
    getSecret,
    secrets,
    secretGroups,
    _404Store,
    androidStore,
    dreamcastStore,
    iwhbydStore,
    konamiCodeStore,
    missingNoStore,
    oceangateStore,
    pspCodeStore,
  };

  return (
    <SecretContext.Provider value={value}>
      <div>
        {children}
      </div>
    </SecretContext.Provider>
  );
}

export function useSecret() {
  const context = useContext(SecretContext);
  if (!context) {
    throw new Error("useSecret must be used within a SecretProvider");
  }
  return context;
}

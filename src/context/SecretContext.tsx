"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useKeySequence } from "@hooks/useKeySequence";
import { AchievementId } from "@enums";
import { secrets, secretGroups, StatDefinition } from "types";
import { SettingStore, useSettings, useSettingStore } from "@stores/setting-store";
import { getStat } from "@config/settings";
import { ActionKeyMap, useKeyboard } from "@hooks";
// import { useSelectedLayoutSegments } from "next/navigation";

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
  ps2Store: SettingStore;
  brixStore: SettingStore;
  debugStore: SettingStore;
  isDebug: boolean;
  wiiStore: SettingStore;
  getSecret: (id: AchievementId | null) => StatDefinition | null;
  currentSecret: StatDefinition | null;
  currentSetting: AchievementId | null;
}

const SecretContext = createContext<SecretContextType | undefined>(undefined);

export function SecretProvider({ children }: { children: React.ReactNode }) {

  // const segments = useSelectedLayoutSegments();
  // const { stores } = useSettingStores();
  const _404Store = useSettingStore("_404", (state) => state, getStat('_404'));
  const androidStore = useSettingStore("ANDROID", (state) => state, getStat('ANDROID'));
  const dreamcastStore = useSettingStore("DREAMCAST", (state) => state, getStat('DREAMCAST'));
  const iwhbydStore = useSettingStore("IWHBYD", (state) => state, getStat('IWHBYD'));
  const konamiCodeStore = useSettingStore("KONAMI_CODE", (state) => state, getStat('KONAMI_CODE'));
  const missingNoStore = useSettingStore("MISSING_NO", (state) => state, getStat('MISSING_NO'));
  const oceangateStore = useSettingStore("OCEANGATE", (state) => state, getStat('OCEANGATE'));
  const pspCodeStore = useSettingStore("PSP", (state) => state, getStat('PSP'));
  const ps2Store = useSettingStore("PS2", (state) => state, getStat('PS2'));
  const brixStore = useSettingStore("BRIX", (state) => state, getStat('BRIX'));
  const debugStore = useSettingStore("DEBUG", (state) => state, getStat('DEBUG'));
  const wiiStore = useSettingStore("WII", (state) => state, getStat('WII'));
  const [currentSecret, setCurrentSecret] = useState<StatDefinition | null>(null);
  const { id } = useSettings((state) => state);

  const getSecret = useCallback((id: AchievementId | null) => {
    if (!id) return null;
    const result = secrets.find(s => s.id === id);
    return result ?? null;
  }, [secrets]);

  useEffect(() => {
    const secret = getSecret(id);
    setCurrentSecret(secret);
  }, [id, getSecret]);

  const debugKeyMap: ActionKeyMap = useMemo(() => {
    return {
      'F3': (e: KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        debugStore.toggle();
      },
    };}, [debugStore]);

  useKeyboard({
    actions: debugKeyMap,
    enabledOnModal: true,
  });

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
    currentSecret,
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
    ps2Store,
    brixStore,
    debugStore,
    isDebug: id === 'DEBUG',
    wiiStore,
    currentSetting: id,
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

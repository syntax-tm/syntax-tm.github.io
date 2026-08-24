"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useKeySequence } from "@hooks/useKeySequence";
import { AchievementId } from "@enums";
import { secrets, secretGroups, StatDefinition } from "types";
import { SettingStore, useSettings, useSettingStore, useSettingStores } from "@stores/setting-store";
import { useSelectedLayoutSegments } from "next/navigation";

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
  wiiStore: SettingStore;
  getSecret: (id: AchievementId | null) => StatDefinition | null;
  currentSecret: StatDefinition | null;
  currentSetting: AchievementId | null;
}

const SecretContext = createContext<SecretContextType | undefined>(undefined);

export function SecretProvider({ children }: { children: React.ReactNode }) {

  const segments = useSelectedLayoutSegments();
  const { stores } = useSettingStores();
  const _404Store = useSettingStore("_404", (state) => state);
  const androidStore = useSettingStore("ANDROID", (state) => state);
  const dreamcastStore = useSettingStore("DREAMCAST", (state) => state);
  const iwhbydStore = useSettingStore("IWHBYD", (state) => state);
  const konamiCodeStore = useSettingStore("KONAMI_CODE", (state) => state);
  const missingNoStore = useSettingStore("MISSING_NO", (state) => state);
  const oceangateStore = useSettingStore("OCEANGATE", (state) => state);
  const pspCodeStore = useSettingStore("PSP", (state) => state);
  const ps2Store = useSettingStore("PS2", (state) => state);
  const brixStore = useSettingStore("BRIX", (state) => state);
  const wiiStore = useSettingStore("WII", (state) => state);
  const [currentSecret, setCurrentSecret] = useState<StatDefinition | null>(null);
  const { id, update } = useSettings((state) => state);

  const getSecret = useCallback((id: AchievementId | null) => {
    if (!id) return null;
    const results = secrets.filter(s => s.id === id);
    return results[0];
  }, [secrets]);

  useEffect(() => {
    const secret = getSecret(id);
    setCurrentSecret(secret);
  }, [id, getSecret]);

  useEffect(() => {

    if (!segments || segments.length === 0) return;

    const rootSegment = segments[0];

    // try to find the matching secret for this route
    const rootSegmentSecret = secrets.find(s => s.id.toLowerCase() === rootSegment);
    if (!rootSegmentSecret) return;

    if (!stores) return;

    const store = stores.get(rootSegmentSecret.id);

    store?.getState().unlock();

    update(rootSegmentSecret.id);

  }, [segments, stores, secrets, update]);

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

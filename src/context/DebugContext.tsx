"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AchievementId } from "@enums";
import { SettingStoreType, useSettings, useSettingStore, useSettingStores } from "@stores/setting-store";
import { getStat } from "@config/settings";
import { useSecret } from "@context";

export interface DebugContextType {
  showBackground: boolean,
  setShowBackground: (value: boolean) => void,
  highlightXmbItems: boolean,
  setHighlightXmbItems: (value: boolean) => void,
  showDebugView: boolean,
  setShowDebugView: (value: boolean) => void,
  showLogView: boolean,
  setShowLogView: (value: boolean) => void,
  showSecrets: boolean,
  setShowSecrets: (value: boolean) => void,
  showToolTips: boolean,
  setShowToolTips: (value: boolean) => void,
  showBoot: boolean,
  setShowBoot: (value: boolean) => void,
  setTheme: (id: AchievementId | null) => void,
  lockSecrets: () => void,
  unlockSecrets: () => void,
  enableSecret: (id: AchievementId) => void,
  disableSecret: (id: AchievementId) => void,
  toggleSecret: (id: AchievementId) => void,
  disableGamepad: boolean,
  setDisableGamepad: (value: boolean) => void,
  disableKeyboard: boolean,
  setDisableKeyboard: (value: boolean) => void,
  disableSwipe: boolean,
  setDisableSwipe: (value: boolean) => void,
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: React.ReactNode }) {

  const { stores } = useSettingStores();
  const { currentSecret } = useSecret();
  const _404Store = useSettingStore("_404", (state) => state, getStat('_404'));
  const { id, update } = useSettings((state) => state);
  const [showBackground, setShowBackground] = useState(true);
  const [showBoot, setShowBoot] = useState(true);
  const [highlightXmbItems, setHighlightXmbItems] = useState(true);
  const [showDebugView, setShowDebugView] = useState(true);
  const [showLogView, setShowLogView] = useState(true);
  const [showSecrets, setShowSecrets] = useState(true);
  const [showToolTips, setShowToolTips] = useState(true);
  const [disableGamepad, setDisableGamepad] = useState(true);
  const [disableKeyboard, setDisableKeyboard] = useState(true);
  const [disableSwipe, setDisableSwipe] = useState(true);

  const lockSecrets = () => {
    for (const [_key, value] of Object.entries(stores!)) {
      const store = value as SettingStoreType;
      store.getState().lock();
    }
  };

  const unlockSecrets = () => {
    for (const [_key, value] of Object.entries(stores!)) {
      const store = value as SettingStoreType;
      store.getState().unlock();
    }
  };

  const setTheme = (id: AchievementId | null) => {
    update(id);
  };

  const enableSecret = (id: AchievementId) => {

  };

  const disableSecret = (id: AchievementId) => {

  };

  const toggleSecret = (id: AchievementId) => {
    const store = stores?.get(id);
    if (!store) return;
    store.getState().toggle();
  };

  const value = {
    showBackground,
    setShowBackground,
    highlightXmbItems,
    setHighlightXmbItems,
    showDebugView,
    setShowDebugView,
    showLogView,
    setShowLogView,
    showSecrets,
    setShowSecrets,
    showToolTips,
    setShowToolTips,
    setTheme,
    lockSecrets,
    unlockSecrets,
    enableSecret,
    disableSecret,
    toggleSecret,
    disableGamepad,
    setDisableGamepad,
    disableKeyboard,
    setDisableKeyboard,
    disableSwipe,
    setDisableSwipe,
    showBoot,
    setShowBoot,
  };

  return (
    <DebugContext.Provider value={value}>
      <div>
        {children}
      </div>
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider");
  }
  return context;
}

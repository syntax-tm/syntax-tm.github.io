"use client";

import React, { createContext, useCallback, useContext, useEffect } from "react";
import { useShallow } from 'zustand/react/shallow'
import { useSnackbar } from "@context/SnackbarContext";
import { useKeySequence } from "@hooks/useKeySequence";
import { AchievementId } from "@enums";
import { StatDefinition, secrets, Setting, secretGroups, StatGroupDefinition } from "types";
import { SnackbarVariant } from "types/snackbar";
import { useSettingsStore } from "@providers/settings-store-provider";

const CANCEL_AUDIO_SRC = '/audio/cancel.mp3';
const TROPHY_AUDIO_SRC = '/audio/trophy.mp3';
const TOGGLE_AUDIO_SRC = '/audio/confirm.mp3';

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
  currentSetting: Setting | undefined;
  currentSecret: AchievementId | undefined;
  getSetting: (id: AchievementId) => Setting | undefined;
  getSecret: (id: AchievementId) => StatDefinition | undefined;
  setUnlocked: (id: AchievementId, isUnlocked: boolean) => void;
  lock: (id: AchievementId) => void;
  unlock: (id: AchievementId) => void;
  setEnabled: (id: AchievementId, isEnabled: boolean) => void;
  enable: (id: AchievementId) => void;
  disable: (id: AchievementId) => void;
  toggle: (id: AchievementId) => void;
  secrets: StatDefinition[];
  secretGroups: StatGroupDefinition[];
  settings: Map<AchievementId, Setting>;
}

// const useSettings = create<Map<AchievementId, Setting>>()(
//   persist(
//     (set, get) => ({
//       settings: ,
//       enable: (id: AchievementId) => set((s) => ({  })),
//     }),
//     {
//       name: "settings",
//       storage: createJSONStorage(() => localStorage),
//     },
//   ),
// );


const SecretContext = createContext<SecretContextType | undefined>(undefined);

export function SecretProvider({ children }: { children: React.ReactNode }) {

  const { settings, setEnabled, setUnlocked, currentSetting } = useSettingsStore(
    useShallow((state) => state),
  );

  const { showSnackbar } = useSnackbar();

  const currentSecret = currentSetting?.id;
  const currentSecretType = currentSetting?.type;

  const getSetting = useCallback((id: AchievementId) => {
    return settings.get(id);
  }, [settings]);

  const getSecret = useCallback((id: AchievementId) => {
    const results = secrets.filter(s => s.id === id);
    return results[0];
  }, [secrets]);

  const enable = useCallback((id: AchievementId) => {
    setEnabled(id, true);
  }, [settings]);

  const disable = useCallback((id: AchievementId) => {
    setEnabled(id, false);
  }, [settings]);

  const lock = useCallback((id: AchievementId) => {
    const setting = settings.get(id);
    if (!setting) return;
    if (!setting.isUnlocked) return;

    setUnlocked(id, false);

    const secret = setting.stat;
    showSnackbar(`Secret Locked`, `'${secret.title}' is now locked.`, 'lock', CANCEL_AUDIO_SRC);
  }, [settings, setUnlocked]);

  const unlock = useCallback((id: AchievementId) => {
    const setting = settings.get(id);
    if (!setting) return;
    if (setting.isUnlocked) return;

    setUnlocked(id, true);

    const secret = setting.stat;
    showSnackbar(secret.title, secret.description, 'unlock', TROPHY_AUDIO_SRC);
  }, [settings, setEnabled]);

  const toggle = useCallback((id: AchievementId) => {
    const setting = settings.get(id);
    if (!setting) return;

    const isEnabled = setting.isEnabled;
    const newState = !isEnabled;

    setEnabled(id, newState);

    const action = newState ? 'Enabled' : 'Disabled';
    const variant: SnackbarVariant = newState ? 'enable' : 'disable';

    showSnackbar(`Secret ${action}`, `'${id}' is now ${newState ? 'enabled' : 'disabled'}.`, variant, TOGGLE_AUDIO_SRC);
  }, [settings, setEnabled]);

  useKeySequence(KONAMI_CODE, () => {
    unlock("KONAMI_CODE");
  });

  useKeySequence(PSP, () => {
    unlock("PSP_CODE");
  });

  useKeySequence(IWHBYD_CODE, () => {
    unlock("IWHBYD");
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleGamepadConnected = () => {
      void unlock("OCEANGATE");
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
    };
  }, [unlock]);

  const value = {
    currentSetting,
    currentSecret,
    getSetting,
    getSecret,
    currentSecretType,
    setEnabled,
    enable,
    disable,
    toggle,
    setUnlocked,
    lock,
    unlock,
    secrets,
    secretGroups,
    settings,
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

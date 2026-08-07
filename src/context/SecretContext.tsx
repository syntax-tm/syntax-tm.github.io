"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSnackbar } from "@context/SnackbarContext";
import { useKeySequence } from "@hooks/useKeySequence";
import { AchievementId, SecretGroupType } from "@enums";
import { StatDefinition, secrets, Setting, defaultSettings, secretGroups, StatGroupDefinition } from "types";
import { SnackbarVariant } from "types/snackbar";
import { useObjectState } from "@uidotdev/usehooks";
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
  activeSetting: Setting | undefined;
  currentSecret: AchievementId | undefined;
  getSetting: (id: AchievementId) => Setting;
  getSecret: (id: AchievementId) => StatDefinition;
  getUnlocked: (id: AchievementId) => boolean;
  setUnlocked: (id: AchievementId, isUnlocked: boolean, saveChanges: boolean) => void;
  lock: (id: AchievementId) => void;
  unlock: (id: AchievementId) => void;
  getEnabled: (id: AchievementId) => boolean;
  setEnabled: (id: AchievementId, isEnabled: boolean, saveChanges: boolean) => void;
  enable: (id: AchievementId) => void;
  disable: (id: AchievementId) => void;
  toggle: (id: AchievementId) => void;
  secrets: StatDefinition[];
  secretGroups: StatGroupDefinition[];
  settings: Setting[] | null;
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

  const { settings } = useSettingsStore(
    (state) => state,
  );
  const settingsRef = useRef<Setting[] | undefined>(undefined);
  const [activeSetting, setActiveSetting] = useState<Setting | undefined>(undefined);
  const [currentSecret, setCurrentSecret] = useState<AchievementId | undefined>(undefined);
  const [currentSecretType, setCurrentSecretType] = useState<SecretGroupType | undefined>(undefined);

  const { showSnackbar } = useSnackbar();

  const STORAGE_KEY = "settings";

  // const save = () => {
  //   if (settingsRef.current) {
  //     const json = JSON.stringify(settingsRef.current, null, 2);
  //     localStorage.setItem(STORAGE_KEY, json);
  //   }
  //   else {
  //     localStorage.removeItem(STORAGE_KEY);
  //   }

  //   setSettings(settingsRef.current);
  // };

  // const load = () => {
  //   if (!localStorage.getItem(STORAGE_KEY)) {
  //     settingsRef.current = defaultSettings;
  //     const defaultJson = JSON.stringify(settingsRef.current, null, 2);
  //     localStorage.setItem(STORAGE_KEY, defaultJson);
  //   }

  //   const json = localStorage.getItem(STORAGE_KEY);

  //   let loaded = json && json !== 'null'
  //     ? JSON.parse(json) as Setting[]
  //     : defaultSettings;

  //   loaded = loaded ?? defaultSettings;

  //   const fromStorage = JSON.parse(json) as Setting[];
  //   settingsRef.current = fromStorage;

  //   setSettings(loaded);

  //   const active = settingsRef.current?.filter(s => s.isEnabled);
  //   if (active && active.length > 0) {
  //     setActive(active[0]);
  //   }

  //   return loaded;

  // };

  // const save = () => {
  //   const json = JSON.stringify(settings, null, 2);
  //   localStorage.setItem(STORAGE_KEY, json);
  // };

  // const load = () => {
  //   let json = localStorage.getItem(STORAGE_KEY);
  //   if (!json || json === 'null') {
  //     json = JSON.stringify(defaultSettings, null, 2);
  //   }
  //   const restored = JSON.parse(json) as Setting[];

  //   setSettings(restored);
  // };

  const getSetting = (id: AchievementId) => {
    if (!settingsRef.current) return;
    const setting = settingsRef.current.filter(s => s.id === id)?.[0];
    return setting;
  };

  const getSecret = useCallback((id: AchievementId) => {
    const results = secrets.filter(s => s.id === id);
    return results[0];
  }, [secrets]);

  const getUnlocked = (id: AchievementId) => {
    if (!settingsRef.current) return;
    const setting = settingsRef.current.filter(s => s.id === id)?.[0];
    if (!setting) return;
    return setting.isUnlocked;
  };

  const getEnabled = (id: AchievementId) => {
    if (!settingsRef.current) return;
    const setting = settingsRef.current.filter(s => s.id === id)?.[0];
    if (!setting) return;
    return setting.isUnlocked && setting.isEnabled;
  };

  const setUnlocked = (id: AchievementId, isUnlocked: boolean) => {

    const active = settingsRef.current?.filter(s => s.isEnabled)?.[0];

    setSettings((s) => ({
      settings: settingsRef.current,
      currentSetting: active,
    }));
  };

  const setEnabled = (id: AchievementId, isEnabled: boolean, saveChanges: boolean = false) => {
    if (!settingsRef.current) return;
    settingsRef.current.forEach(s => {
      if (s.id === id) {
        s.isUnlocked = isEnabled;
        s.isEnabled = isEnabled;

        if (isEnabled) {
          setActive(s);
        }
      }
      else {
        s.isEnabled = !isEnabled;
      }
    });

    save();
  };

  const enable = useCallback((id: AchievementId) => {
    if (!settingsRef.current) return;
    const setting = settingsRef.current.filter(s => s.id === id)?.[0];
    if (!setting) return;
    setting.isEnabled = true;
    setActive(setting);
    save();
  }, [settings]);

  const disable = useCallback((id: AchievementId) => {
    if (!settingsRef.current) return;
    const setting = settingsRef.current.filter(s => s.id === id)?.[0];
    if (!setting) return;
    setting.isEnabled = false;
    save();
  }, [settings]);

  const lock = useCallback((id: AchievementId) => {
    if (!settingsRef.current) return;
    const setting = settingsRef.current.filter(s => s.id === id)?.[0];
    if (!setting) return;

    const stat = setting.stat;
    //const isLockedByDefault = stat.isLocked ?? true;

    setting.isUnlocked = false;

    showSnackbar(`Secret Locked`, `'${stat.title}' is now locked.`, 'lock', CANCEL_AUDIO_SRC);

    save();
  }, [settings]);

  const unlock = (id: AchievementId) => {
    if (!settingsRef.current) return;
    const setting = settingsRef.current.filter(s => s.id === id)?.[0];
    if (!setting) return;
    if (setting.isUnlocked) return;

    // save that it's unlocked and enabled automatically
    setting.isUnlocked = true;

    //const isEnabledByDefault = setting.stat.isEnabled;
    setting.isEnabled = true; // isEnabledByDefault ?? false;

    const secret = setting.stat;
    //showSnackbar(`Secret Unlocked`, `${secret.title}: ${secret.description}`, 'unlock');
    showSnackbar(secret.title, secret.description, 'unlock', TROPHY_AUDIO_SRC);

    save();
  };

  const toggle = (id: AchievementId) => {
    if (!settingsRef.current) return;
    const setting = settingsRef.current.filter(s => s.id === id)?.[0];
    if (!setting) return;
    // make sure that it has been unlocked first
    // TODO: conisder throwing error here if not unlocked
    if (!setting.isUnlocked) return;

    const isEnabled = setting.isEnabled;
    const newState = !isEnabled;

    const action = newState ? 'Enabled' : 'Disabled';
    const variant: SnackbarVariant = newState ? 'enable' : 'disable';

    showSnackbar(`Secret ${action}`, `'${id}' is now ${newState ? 'enabled' : 'disabled'}.`, variant, TOGGLE_AUDIO_SRC);

    // save the new setting value
    setting.isEnabled = newState;

    save();
  };

  const setActive = (setting: Setting) => {
    const enabledSetting = setting;

    setActiveSetting(enabledSetting);
    setCurrentSecret(enabledSetting?.id);
    setCurrentSecretType(enabledSetting?.type);

    settingsRef.current?.forEach(s => {
      if (s.id === setting.id) return;
      s.isEnabled = false;
    });
  };

  useEffect(() => {
    save();
  }, [settings]);

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

  useEffect(() => {
    load();
  }, []);

  const value = {
    activeSetting,
    currentSecret,
    getSetting,
    getSecret,
    currentSecretType,
    getEnabled,
    setEnabled,
    enable,
    disable,
    toggle,
    getUnlocked,
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
function useCounterStore(arg0: (state: any) => any): { count: any; incrementCount: any; decrementCount: any; } {
  throw new Error("Function not implemented.");
}


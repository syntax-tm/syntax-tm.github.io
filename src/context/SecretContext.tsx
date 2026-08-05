"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import localFont from "next/font/local";
import { useAudio } from '@context/AudioContext';
import { useSnackbar } from "@context/SnackbarContext";
import { useKeySequence } from "@hooks/useKeySequence";
import { AchievementId } from "@enums";
import { StatDefinition, secrets, secretGroups, Setting, StatGroupMap, statDefs } from "types";
import { SnackbarVariant } from "types/snackbar";

const CANCEL_AUDIO_SRC = '/audio/cancel.mp3';
const TROPHY_AUDIO_SRC = '/audio/trophy.mp3';

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

const pspFont = localFont({
  src: '../../public/fonts/FOT-NewRodin Pro L.otf',
  variable: '---newrodin-pro',
  style: 'normal',
  weight: '400',
  preload: true,
});

const dreamcastFont = localFont({
  src: '../../public/fonts/NiseSegaDreamcast.ttf',
  variable: '---nise-sega-dreamcast',
  style: 'normal',
  weight: '400',
  preload: true,
});

export interface SecretContextType {
  // unlocked
  isKonamiSecretUnlocked: boolean;
  isPspSecretUnlocked: boolean;
  isIwhbydSecretUnlocked: boolean;
  is404SecretUnlocked: boolean;
  isOceangateSecretUnlocked: boolean;
  isAndroidSecretUnlocked: boolean;
  isMissingNoSecretUnlocked: boolean;
  isDreamcastSecretUnlocked: boolean;

  // active (setting)
  isKonamiSecretActive: boolean;
  isPspSecretActive: boolean;
  isIwhbydSecretActive: boolean;
  is404SecretActive: boolean;
  isOceangateSecretActive: boolean;
  isAndroidSecretActive: boolean;
  isMissingNoSecretActive: boolean;
  isDreamcastSecretActive: boolean;

  getActiveTheme: () => AchievementId | null;
  isThemeActive: (id?: AchievementId | null) => boolean;
  getActiveBackground: () => AchievementId | null;
  isBackgroundActive: (id?: AchievementId | null) => boolean;
  isSecretUnlocked: (id: AchievementId) => boolean;
  setSecretUnlocked: (id: AchievementId, isUnlocked: boolean, refresh?: boolean) => void;
  isSecretEnabled: (id: AchievementId) => boolean;
  setSecretEnabled: (id: AchievementId, isEnabled: boolean, refresh?: boolean) => void;
  lockSecret: (id: AchievementId) => void;
  unlockSecret: (id: AchievementId) => void;
  toggleSecret: (id: AchievementId) => void;
  secrets: StatDefinition[];
  secretGroups: StatGroupMap;
  settings: Map<AchievementId, Setting> | null;
  dreamcastFontClass: string;
  pspFontClass: string;
}

const SecretContext = createContext<SecretContextType | undefined>(undefined);

export function SecretProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Map<AchievementId, Setting> | null>(null);

  // is unlocked (enables preference)
  const [isKonamiSecretUnlocked, setIsKonamiSecretUnlocked] = useState(false);
  const [isPspSecretUnlocked, setIsPspSecretUnlocked] = useState(false);
  const [isIwhbydSecretUnlocked, setIsIwhbydSecretUnlocked] = useState(false);
  const [is404SecretUnlocked, setIs404SecretUnlocked] = useState(false);
  const [isOceangateSecretUnlocked, setIsOceangateSecretUnlocked] = useState(false);
  const [isAndroidSecretUnlocked, setIsAndroidSecretUnlocked] = useState(false);
  const [isMissingNoSecretUnlocked, setIsMissingNoSecretUnlocked] = useState(false);
  const [isDreamcastSecretUnlocked, setIsDreamcastSecretUnlocked] = useState(false);

  // is active (preference)
  const [isKonamiSecretActive, setIsKonamiSecretActive] = useState(false);
  const [isPspSecretActive, setIsPspSecretActive] = useState(false);
  const [isIwhbydSecretActive, setIsIwhbydSecretActive] = useState(false);
  const [is404SecretActive, setIs404SecretActive] = useState(false);
  const [isOceangateSecretActive, setIsOceangateSecretActive] = useState(false);
  const [isAndroidSecretActive, setIsAndroidSecretActive] = useState(false);
  const [isMissingNoSecretActive, setIsMissingNoSecretActive] = useState(false);
  const [isDreamcastSecretActive, setIsDreamcastSecretActive] = useState(false);
  const { play } = useAudio();
  const { showSnackbar } = useSnackbar();

  const getUnlockedKey = (id: string) => `${id.toLowerCase()}_unlocked`;
  const getEnabledKey = (id: string) => `${id.toLowerCase()}_enabled`;

  const isSecretUnlocked = (id: AchievementId) => {
    const settingName = getUnlockedKey(id);
    const value = localStorage.getItem(settingName);
    if (!value) return false;
    return value === 'true';
  };

  const setSecretUnlocked = (id: AchievementId, isUnlocked: boolean, refresh: boolean = true) => {
    const settingName = getUnlockedKey(id);
    localStorage.setItem(settingName, isUnlocked ? 'true' : 'false');

    if (refresh)
      refreshStats();
  };

  const isSecretEnabled = (id: AchievementId) => {
    const settingName = getEnabledKey(id);
    const value = localStorage.getItem(settingName);
    if (!value) return false;
    return value === 'true';
  };

  const getSecret = (id: AchievementId) => {
    return secrets.filter(s => s.id === id)[0];
  };

  const setSecretEnabled = (id: AchievementId, isEnabled: boolean, refresh: boolean = true) => {
    const settingName = getEnabledKey(id);
    localStorage.setItem(settingName, isEnabled ? 'true' : 'false');

    // check if this is a radio group item, if it is then toggle
    // all of the other secrets to false and force a refresh
    if (isEnabled) {
      const type = getSecret(id).type;
      const otherSecrets = Object.values(secrets).filter(s => s.id !== id && s.type === type).map(s => s.id);
      otherSecrets.forEach(o => {
        const otherName = getEnabledKey(o);
        localStorage.setItem(otherName, 'false');
      });

      // force the refresh if we were updating a radio group
      refresh = true;
    }

    if (refresh)
      refreshStats();
  };

  const lockSecret = (id: AchievementId) => {
    // check to see if it is already locked
    const isUnlocked = isSecretUnlocked(id);
    if (!isUnlocked) return;

    // save that it's locked and disabled now
    setSecretUnlocked(id, false);
    setSecretEnabled(id, false, true);

    const secret = getSecret(id);
    showSnackbar(`Secret Locked`, `'${secret.title}' is now locked.`, 'lock');

    void play(CANCEL_AUDIO_SRC);
  };

  const unlockSecret = (id: AchievementId) => {
    // check to see if it has already been unlocked
    const isUnlocked = isSecretUnlocked(id);
    if (isUnlocked) return;

    // save that it's unlocked and enabled automatically
    setSecretUnlocked(id, true);
    setSecretEnabled(id, true);

    const secret = getSecret(id);
    //showSnackbar(`Secret Unlocked`, `${secret.title}: ${secret.description}`, 'unlock');
    showSnackbar(secret.title, secret.description, 'unlock');

    void play(TROPHY_AUDIO_SRC);

    refreshStats();
  };

  const toggleSecret = (id: AchievementId) => {
    // make sure that it has been unlocked first
    // TODO: conisder throwing error here if not unlocked
    const isUnlocked = isSecretUnlocked(id);
    if (!isUnlocked) return;

    const isEnabled = isSecretEnabled(id);
    const newState = !isEnabled;

    const action = newState ? 'Enabled' : 'Disabled';
    const variant: SnackbarVariant = newState ? 'enable' : 'disable';

    showSnackbar(`Secret ${action}`, `'${id}' is now ${newState ? 'enabled' : 'disabled'}.`, variant);

    // save the new setting value
    setSecretEnabled(id, newState);

    refreshStats();
  };

  const getActiveTheme = useCallback((): AchievementId | null => {
    if (!settings) return null;
    const theme = Array.from(settings)
      .filter(([, s]) => s.type === "THEME")
      .map(([id]) => id)
      .filter(id => isSecretEnabled(id))
      ?.[0];
    return theme ?? null;
  }, [settings]);

  const isThemeActive = useCallback((id: AchievementId | null = null): boolean => {
    if (id) {
      return isSecretEnabled(id);
    }

    const activeTheme = getActiveTheme();
    return activeTheme !== null;
  }, [settings]);

  const getActiveBackground = useCallback((): AchievementId | null => {
    if (!settings) return null;
    const bg = Array.from(settings)
      .filter(([, s]) => s.type === "BG")
      .map(([id]) => id)
      .filter(id => isSecretEnabled(id))
      ?.[0];
    return bg ?? null;
  }, [settings]);

  const isBackgroundActive = useCallback((id: AchievementId | null = null): boolean => {
    if (id) {
      return isSecretEnabled(id);
    }

    const activeBg = getActiveBackground();
    return activeBg !== null;
  }, [settings]);

  const refreshStats = () => {
    const playerStats = new Map<AchievementId, Setting>();
    const ids = statDefs.map(s => s.id);
    ids.map((id) => {
      const isUnlocked = isSecretUnlocked(id);
      const isEnabled = isSecretEnabled(id);
      const playerStat: Setting = {
        id,
        isUnlocked,
        stat: getSecret(id),
        isEnabled,
        type: getSecret(id).type,
      };
      playerStats.set(id, playerStat);

      if (id === "KONAMI_CODE") {
        setIsKonamiSecretUnlocked(isUnlocked);
        setIsKonamiSecretActive(isEnabled);
      }
      else if (id === "PSP_CODE") {
        setIsPspSecretUnlocked(isUnlocked);
        setIsPspSecretActive(isEnabled);
      }
      else if (id === "IWHBYD") {
        setIsIwhbydSecretUnlocked(isUnlocked);
        setIsIwhbydSecretActive(isEnabled);
      }
      else if (id === "_404") {
        setIs404SecretUnlocked(isUnlocked);
        setIs404SecretActive(isEnabled);
      }
      else if (id === "OCEANGATE") {
        setIsOceangateSecretUnlocked(isUnlocked);
        setIsOceangateSecretActive(isEnabled);
      }
      else if (id === "ANDROID") {
        setIsAndroidSecretUnlocked(isUnlocked);
        setIsAndroidSecretActive(isEnabled);
      }
      else if (id === "MISSING_NO") {
        setIsMissingNoSecretUnlocked(isUnlocked);
        setIsMissingNoSecretActive(isEnabled);
      }
      else if (id === "DREAMCAST") {
        setIsDreamcastSecretUnlocked(isUnlocked);
        setIsDreamcastSecretActive(isEnabled);
      }
      // TODO: add filter secrets
    });

    setSettings(playerStats);
  };

  useKeySequence(KONAMI_CODE, () => {
    unlockSecret("KONAMI_CODE");
  });

  useKeySequence(PSP, () => {
    unlockSecret("PSP_CODE");
  });

  useKeySequence(IWHBYD_CODE, () => {
    unlockSecret("IWHBYD");
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleGamepadConnected = () => {
      void unlockSecret("OCEANGATE");
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
    };
  }, [unlockSecret]);

  useEffect(() => {
    refreshStats();
  }, []);

  useEffect(() => {
    const handleSecretActivate = () => {
      void unlockSecret("KONAMI_CODE");
    };

    const handlePspSecretActivate = () => {
      void unlockSecret("PSP_CODE");
    };

    const handleOceangateSecretActivate = () => {
      void unlockSecret("OCEANGATE");
    };

    const handle404SecretActivate = () => {
      void unlockSecret("_404");
    };

    const handleIwhbydSecretActivate = () => {
      void unlockSecret("IWHBYD");
    };

    const handleMissingNoSecretActivate = () => {
      void unlockSecret("MISSING_NO");
    };

    const handleAndroidSecretActivate = () => {
      void unlockSecret("ANDROID");
    };

    const handleDreamcastSecretActivate = () => {
      void unlockSecret("DREAMCAST");
    };

    document.addEventListener("secret:konami:activate", handleSecretActivate);
    document.addEventListener("secret:psp:activate", handlePspSecretActivate);
    document.addEventListener("secret:oceangate:activate", handleOceangateSecretActivate);
    document.addEventListener("secret:404:activate", handle404SecretActivate);
    document.addEventListener("secret:iwhbyd:activate", handleIwhbydSecretActivate);
    document.addEventListener("secret:missing_no:activate", handleMissingNoSecretActivate);
    document.addEventListener("secret:android:activate", handleAndroidSecretActivate);
    document.addEventListener("secret:dreamcast:activate", handleDreamcastSecretActivate);

    return () => {
      document.removeEventListener("secret:konami:activate", handleSecretActivate);
      document.removeEventListener("secret:psp:activate", handlePspSecretActivate);
      document.removeEventListener("secret:oceangate:activate", handleOceangateSecretActivate);
      document.removeEventListener("secret:404:activate", handle404SecretActivate);
      document.removeEventListener("secret:iwhbyd:activate", handleIwhbydSecretActivate);
      document.removeEventListener("secret:missing_no:activate", handleMissingNoSecretActivate);
      document.removeEventListener("secret:android:activate", handleAndroidSecretActivate);
      document.removeEventListener("secret:dreamcast:activate", handleDreamcastSecretActivate);
    };
  }, []);

  const value = {

    // unlocked
    isKonamiSecretUnlocked,
    isPspSecretUnlocked,
    isIwhbydSecretUnlocked,
    is404SecretUnlocked,
    isOceangateSecretUnlocked,
    isAndroidSecretUnlocked,
    isMissingNoSecretUnlocked,
    isDreamcastSecretUnlocked,

    // setting enabled
    isKonamiSecretActive,
    isPspSecretActive,
    isIwhbydSecretActive,
    is404SecretActive,
    isOceangateSecretActive,
    isAndroidSecretActive,
    isMissingNoSecretActive,
    isDreamcastSecretActive,

    getActiveTheme,
    isThemeActive,
    getActiveBackground,
    isBackgroundActive,
    isSecretUnlocked,
    setSecretUnlocked,
    isSecretEnabled,
    setSecretEnabled,
    lockSecret,
    unlockSecret,
    toggleSecret,
    secretGroups,
    secrets: statDefs,
    settings,
    dreamcastFontClass: dreamcastFont.className,
    pspFontClass: pspFont.className,
  };

  let fontClass = '';

  if (isPspSecretActive) {
    fontClass = pspFont.className;
  }
  else if (isDreamcastSecretActive) {
    fontClass = dreamcastFont.className;
  }

  return (
    <SecretContext.Provider value={value}>
      <div className={`${fontClass}`}>
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

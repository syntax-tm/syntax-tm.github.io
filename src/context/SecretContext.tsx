"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAudio } from '@context/AudioContext';
import { useSnackbar } from "@context/SnackbarContext";
import { useGamepads } from 'awesome-react-gamepads';
import { useKeySequence } from "@hooks/useKeySequence";
import localFont from "next/font/local";
import { SnackbarVariant } from "@components/types";

const SECRET_AUDIO_SRC = '/audio/startup.mp3';
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

export enum AchievementId {
  konami_code = "KONAMI_CODE",
  psp_code = "PSP_CODE",
  iwhbyd = "IWHBYD",
  oceangate = "OCEANGATE",
  _404 = "404",
  android = "ANDROID",
  missing_no = "MISSING_NO",
};

const pspFont = localFont({
  src: '../../public/fonts/FOT-NewRodin Pro L.otf',
  variable: '---newrodin-pro',
  style: 'normal',
  weight: '400',
  preload: true,
});

export type SecretGroupType = 'bg' | 'theme';

export interface StatDefinition {
  id: AchievementId;
  title: string;
  description?: string;
  type?: SecretGroupType;
  // TODO: add icon for locked/unlocked
  // TODO: add a hint indicating how this can be unlocked
}

export interface PlayerStat {
  id: AchievementId;
  stat: StatDefinition;
  isUnlocked: boolean;
  isEnabled: boolean;
  type?: SecretGroupType;
}

export interface SecretGroup {
  type: SecretGroupType,
  title: string,
  isRadio?: boolean,
}

export type SecretGroupMap = Record<SecretGroupType, SecretGroup>;

export const secretGroups: SecretGroupMap =
{
  // ['default']: {
  //   type: 'default',
  //   title: 'General',
  // },
  ['bg']: {
    type: 'bg',
    title: 'Background',
    isRadio: true,
  },
  ['theme']: {
    type: 'theme',
    title: 'Theme',
    isRadio: true,
  },
};

export type SecretMap = Record<AchievementId, StatDefinition>;

export const secrets: SecretMap =
{
  [AchievementId.konami_code]: {
    id: AchievementId.konami_code,
    title: 'Konami Code',
    description: 'Entered the Konami Code.',
    type: 'bg',
  },
  [AchievementId.psp_code]: {
    id: AchievementId.psp_code,
    title: 'PSP Mode',
    description: 'Flash CFW.',
    type: 'theme',
  },
  [AchievementId._404]: {
    id: AchievementId._404,
    title: '404',
    description: "There was a page here, but it's gone now.",
    type: 'bg',
  },
  [AchievementId.iwhbyd]: {
    id: AchievementId.iwhbyd,
    title: 'IWHBYD',
    description: '"I Would Have Been Your Daddy"',
    type: 'bg',
  },
  [AchievementId.oceangate]: {
    id: AchievementId.oceangate,
    title: 'Oceangate',
    description: "Submersible not included.",
    type: 'bg',
  },
  [AchievementId.android]: {
    id: AchievementId.android,
    title: 'Android',
    description: "Tap tap tap.",
    type: 'bg',
  },
  [AchievementId.missing_no]: {
    id: AchievementId.missing_no,
    title: 'MissingNo.',
    description: "<Memory Corrupted>",
    type: 'bg',
  },
};

export interface SecretContextType {
  // unlocked
  isKonamiSecretUnlocked: boolean;
  isPspSecretUnlocked: boolean;
  isIwhbydSecretUnlocked: boolean;
  is404SecretUnlocked: boolean;
  isOceangateSecretUnlocked: boolean;
  isAndroidSecretUnlocked: boolean;
  isMissingNoSecretUnlocked: boolean;

  // active (setting)
  isKonamiSecretActive: boolean;
  isPspSecretActive: boolean;
  isIwhbydSecretActive: boolean;
  is404SecretActive: boolean;
  isOceangateSecretActive: boolean;
  isAndroidSecretActive: boolean;
  isMissingNoSecretActive: boolean;

  getBackground: () => AchievementId | null;
  isBackground: (id: AchievementId) => boolean;
  isSecretUnlocked: (id: AchievementId) => boolean;
  setSecretUnlocked: (id: AchievementId, isUnlocked: boolean, refresh?: boolean) => void;
  isSecretEnabled: (id: AchievementId) => boolean;
  setSecretEnabled: (id: AchievementId, isEnabled: boolean, refresh?: boolean) => void;
  lockSecret: (id: AchievementId) => Promise<void>;
  unlockSecret: (id: AchievementId) => Promise<void>;
  toggleSecret: (id: AchievementId) => void;
  secrets: Record<string, StatDefinition>;
  secretGroups: Record<SecretGroupType, SecretGroup>;
  stats: Map<AchievementId, PlayerStat> | null;
  pspFontClass: string;
}

const SecretContext = createContext<SecretContextType | undefined>(undefined);

export function SecretProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Map<AchievementId, PlayerStat> | null>(null);

  // is unlocked (enables preference)
  const [isKonamiSecretUnlocked, setIsKonamiSecretUnlocked] = useState(false);
  const [isPspSecretUnlocked, setIsPspSecretUnlocked] = useState(false);
  const [isIwhbydSecretUnlocked, setIsIwhbydSecretUnlocked] = useState(false);
  const [is404SecretUnlocked, setIs404SecretUnlocked] = useState(false);
  const [isOceangateSecretUnlocked, setIsOceangateSecretUnlocked] = useState(false);
  const [isAndroidSecretUnlocked, setIsAndroidSecretUnlocked] = useState(false);
  const [isMissingNoSecretUnlocked, setIsMissingNoSecretUnlocked] = useState(false);

  // is active (preference)
  const [isKonamiSecretActive, setIsKonamiSecretActive] = useState(false);
  const [isPspSecretActive, setIsPspSecretActive] = useState(false);
  const [isIwhbydSecretActive, setIsIwhbydSecretActive] = useState(false);
  const [is404SecretActive, setIs404SecretActive] = useState(false);
  const [isOceangateSecretActive, setIsOceangateSecretActive] = useState(false);
  const [isAndroidSecretActive, setIsAndroidSecretActive] = useState(false);
  const [isMissingNoSecretActive, setIsMissingNoSecretActive] = useState(false);
  const { play } = useAudio();
  const { showSnackbar } = useSnackbar();

  const getUnlockedKey = (id: AchievementId) => `${id}_unlocked`;
  const getEnabledKey = (id: AchievementId) => `${id}_enabled`;

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

  const setSecretEnabled = (id: AchievementId, isEnabled: boolean, refresh: boolean = true) => {
    const settingName = getEnabledKey(id);
    localStorage.setItem(settingName, isEnabled ? 'true' : 'false');

    // check if this is a radio group item, if it is then toggle
    // all of the other secrets to false and force a refresh
    if (isEnabled && isRadioGroup(id)) {
      const otherSecrets = getRadioGroup(id);
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

  const isRadioGroup = (id: AchievementId): boolean => {
    const type = secrets[id].type;
    const group = secretGroups[type as SecretGroupType];
    return group.isRadio ?? false;
  };

  const getRadioGroup = (id: AchievementId): AchievementId[] => {
    if (!isRadioGroup(id)) return [];
    const type = secrets[id].type;
    return Object.values(secrets).filter(s => s.id !== id && s.type === type).map(s => s.id);
  };

  const lockSecret = useCallback(async (id: AchievementId) => {

    // check to see if it is already locked
    const isUnlocked = isSecretUnlocked(id);
    if (!isUnlocked) return;

    // save that it's locked and disabled now
    setSecretUnlocked(id, false);
    setSecretEnabled(id, false);

    const secret = secrets[id];
    const variant: SnackbarVariant = 'lock';
    showSnackbar(`Secret Locked`, `'${secret.title}' is now locked.`, variant);

    if (id === AchievementId.konami_code) {
      setIsKonamiSecretUnlocked(false);
    }
    else if (id === AchievementId.psp_code) {
      setIsPspSecretUnlocked(false);
    }
    else if (id === AchievementId.iwhbyd) {
      setIsIwhbydSecretUnlocked(false);
    }
    else if (id === AchievementId._404) {
      setIs404SecretUnlocked(false);
    }
    else if (id === AchievementId.oceangate) {
      setIsOceangateSecretUnlocked(false);
    }
    else if (id === AchievementId.android) {
      setIsAndroidSecretUnlocked(false);
    }
    else if (id === AchievementId.missing_no) {
      setIsMissingNoSecretUnlocked(false);
    }
    else {
      // if any enum case is missed, TypeScript flags an error here
      const exhaustiveCheck: never = id;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }, []);

  const unlockSecret = useCallback(async (id: AchievementId) => {

    // check to see if it has already been unlocked
    const isUnlocked = isSecretUnlocked(id);
    if (isUnlocked) return;

    // save that it's unlocked and enabled automatically
    setSecretUnlocked(id, true);
    setSecretEnabled(id, true);

    const secret = secrets[id];
    showSnackbar(`Secret'${secret.title}' Unlocked`, `${secret.description}`, 'unlock');

    play(SECRET_AUDIO_SRC);

    refreshStats();

  }, []);

  const toggleSecret = useCallback((id: AchievementId) => {

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
  }, []);

  const getBackground = useCallback((): AchievementId | null => {
    if (!stats) return null;
    const bgSecrets = Array.from(stats).filter(([, s]) => s.type === 'bg').map(([id]) => id);
    for (const id of bgSecrets) {
      if (isSecretEnabled(id)) {
        return id;
      }
    }
    return null;
  }, [stats]);

  const isBackground = useCallback((id: AchievementId): boolean => {
    const secret = secrets[id];
    return secret.type === 'bg';
  }, []);

  const refreshStats = useCallback(() => {
    const playerStats = new Map<AchievementId, PlayerStat>();
    Object.keys(AchievementId)
      .map((achId) => {
        const id = AchievementId[achId as keyof typeof AchievementId];
        const isUnlocked = isSecretUnlocked(id);
        const isEnabled = isSecretEnabled(id);
        const playerStat: PlayerStat = {
          id,
          isUnlocked,
          stat: secrets[id],
          isEnabled,
          type: secrets[id].type,
        };
        playerStats.set(id, playerStat);

        if (id === AchievementId.konami_code) {
          setIsKonamiSecretUnlocked(isUnlocked);
          setIsKonamiSecretActive(isEnabled);
        }
        else if (id === AchievementId.psp_code) {
          setIsPspSecretUnlocked(isUnlocked);
          setIsPspSecretActive(isEnabled);
        }
        else if (id === AchievementId.iwhbyd) {
          setIsIwhbydSecretUnlocked(isUnlocked);
          setIsIwhbydSecretActive(isEnabled);
        }
        else if (id === AchievementId._404) {
          setIs404SecretUnlocked(isUnlocked);
          setIs404SecretActive(isEnabled);
        }
        else if (id === AchievementId.oceangate) {
          setIsOceangateSecretUnlocked(isUnlocked);
          setIsOceangateSecretActive(isEnabled);
        }
        else if (id === AchievementId.android) {
          setIsAndroidSecretUnlocked(isUnlocked);
          setIsAndroidSecretActive(isEnabled);
        }
        else if (id === AchievementId.missing_no) {
          setIsMissingNoSecretUnlocked(isUnlocked);
          setIsMissingNoSecretActive(isEnabled);
        }
      });

    setStats(playerStats);
  }, []);

  useKeySequence(KONAMI_CODE, () => {
    unlockSecret(AchievementId.konami_code);
  });

  useKeySequence(PSP, () => {
    unlockSecret(AchievementId.psp_code);
  });

  useKeySequence(IWHBYD_CODE, () => {
    unlockSecret(AchievementId.iwhbyd);
  });

  useGamepads({
    onConnect: () => {
      unlockSecret(AchievementId.oceangate);
    },
    onKonamiSuccess: () => {
      unlockSecret(AchievementId.konami_code);
    },
  });

  useEffect(() => {
    refreshStats();
  }, []);

  useEffect(() => {
    const handleSecretActivate = () => {
      void unlockSecret(AchievementId.konami_code);
    };

    const handlePspSecretActivate = () => {
      void unlockSecret(AchievementId.psp_code);
    };

    const handleOceangateSecretActivate = () => {
      void unlockSecret(AchievementId.oceangate);
    };

    const handle404SecretActivate = () => {
      void unlockSecret(AchievementId._404);
    };

    const handleIwhbydSecretActivate = () => {
      void unlockSecret(AchievementId.iwhbyd);
    };

    const handleMissingNoSecretActivate = () => {
      void unlockSecret(AchievementId.missing_no);
    };

    document.addEventListener("secret:konami:activate", handleSecretActivate);
    document.addEventListener("secret:psp:activate", handlePspSecretActivate);
    document.addEventListener("secret:oceangate:activate", handleOceangateSecretActivate);
    document.addEventListener("secret:404:activate", handle404SecretActivate);
    document.addEventListener("secret:iwhbyd:activate", handleIwhbydSecretActivate);
    document.addEventListener("secret:missing_no:activate", handleMissingNoSecretActivate);
    document.addEventListener("secret:android:activate", handleMissingNoSecretActivate);

    return () => {
      document.removeEventListener("secret:konami:activate", handleSecretActivate);
      document.removeEventListener("secret:psp:activate", handlePspSecretActivate);
      document.removeEventListener("secret:oceangate:activate", handleOceangateSecretActivate);
      document.removeEventListener("secret:404:activate", handle404SecretActivate);
      document.removeEventListener("secret:iwhbyd:activate", handleIwhbydSecretActivate);
      document.removeEventListener("secret:missing_no:activate", handleMissingNoSecretActivate);
      document.removeEventListener("secret:android:activate", handleMissingNoSecretActivate);
    };
  }, [toggleSecret]);

  const value = {

    // unlocked
    isKonamiSecretUnlocked,
    isPspSecretUnlocked,
    isIwhbydSecretUnlocked,
    is404SecretUnlocked,
    isOceangateSecretUnlocked,
    isAndroidSecretUnlocked,
    isMissingNoSecretUnlocked,

    // setting enabled
    isKonamiSecretActive,
    isPspSecretActive,
    isIwhbydSecretActive,
    is404SecretActive,
    isOceangateSecretActive,
    isAndroidSecretActive,
    isMissingNoSecretActive,

    getBackground,
    isBackground,
    isSecretUnlocked,
    setSecretUnlocked,
    isSecretEnabled,
    setSecretEnabled,
    lockSecret,
    unlockSecret,
    toggleSecret,
    secretGroups,
    secrets,
    stats,
    pspFontClass: pspFont.className,
  };

  return (
    <SecretContext.Provider value={value}>
      <div className={`${isPspSecretActive && pspFont.className}`}>
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

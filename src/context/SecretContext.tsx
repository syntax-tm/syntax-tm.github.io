"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAudio } from '@context/AudioContext';
import { useSnackbar } from "@context/SnackbarContext";
import { useGamepads } from 'awesome-react-gamepads';
import { useKeySequence } from "@hooks/useKeySequence";
import { tryParseJSONObject } from "@services/utils";
import localFont from "next/font/local";
import { SnackbarVariant } from "@src/components/types";

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
  "I", "W", "H",
  "B", "Y", "D",
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

export interface StatDefinition {
  id: AchievementId;
  title: string;
  description?: string;
  // TODO: add icon for locked/unlocked
  // TODO: add a hint indicating how this can be unlocked
}

export interface PlayerStat {
  id: AchievementId;
  stat: StatDefinition;
  isUnlocked: boolean;
  isEnabled: boolean;
}

export type SecretMap = Record<AchievementId, StatDefinition>;

export const secrets: SecretMap =
{
  [AchievementId.konami_code]: {
    id: AchievementId.konami_code,
    title: 'Konami Code',
    description: 'Entered the Konami Code.',
  },
  [AchievementId.psp_code]: {
    id: AchievementId.psp_code,
    title: 'PSP Mode',
    description: 'Flash CFW.',
  },
  [AchievementId._404]: {
    id: AchievementId._404,
    title: '404',
    description: "There was a page here, but it's gone now.",
  },
  [AchievementId.iwhbyd]: {
    id: AchievementId.iwhbyd,
    title: 'IWHBYD',
    description: '"I Would Have Been Your Daddy"',
  },
  [AchievementId.oceangate]: {
    id: AchievementId.oceangate,
    title: 'Oceangate',
    description: "Submersible not included.",
  },
  [AchievementId.android]: {
    id: AchievementId.android,
    title: 'Android',
    description: "Tap tap tap.",
  },
  [AchievementId.missing_no]: {
    id: AchievementId.missing_no,
    title: 'MissingNo.',
    description: "<Memory Corrupted>",
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

  isSecretUnlocked: (id: AchievementId) => boolean;
  setSecretUnlocked: (id: AchievementId, isUnlocked: boolean) => void;
  isSecretEnabled: (id: AchievementId) => boolean;
  setSecretEnabled: (id: AchievementId, isEnabled: boolean) => void;
  lockSecret: (id: AchievementId) => Promise<void>;
  unlockSecret: (id: AchievementId) => Promise<void>;
  toggleSecret: (id: AchievementId) => Promise<void>;
  secrets: Record<AchievementId, StatDefinition>;
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

  const setSecretUnlocked = useCallback((id: AchievementId, isUnlocked: boolean) => {
    const settingName = getUnlockedKey(id);
    localStorage.setItem(settingName, isUnlocked ? 'true' : 'false');

    refreshStats();
  }, [stats]);

  const isSecretEnabled = (id: AchievementId) => {
    const settingName = getEnabledKey(id);
    const value = localStorage.getItem(settingName);
    if (!value) return false;
    return value === 'true';
  };

  const setSecretEnabled = useCallback((id: AchievementId, isEnabled: boolean) => {
    const settingName = getEnabledKey(id);
    localStorage.setItem(settingName, isEnabled ? 'true' : 'false');

    refreshStats();
  }, [stats]);

  const lockSecret = useCallback(async (id: AchievementId) => {

    // check to see if it is already locked
    const isUnlocked = isSecretUnlocked(id);
    if (!isUnlocked) return;

    // save that it's unlocked and enabled automatically
    setSecretUnlocked(id, false);
    setSecretEnabled(id, false);

    const secret = secrets[id];
    const variant: SnackbarVariant = 'lock';
    showSnackbar(`Secret ${secret.title} Locked`, undefined, variant);

    if (id === AchievementId.konami_code) {
      setIsKonamiSecretUnlocked(false);
      setIsKonamiSecretActive(false);
    }
    else if (id === AchievementId.psp_code) {
      setIsPspSecretUnlocked(false);
      setIsPspSecretActive(false);
    }
    else if (id === AchievementId.iwhbyd) {
      setIsIwhbydSecretUnlocked(false);
      setIsIwhbydSecretActive(false);
    }
    else if (id === AchievementId._404) {
      setIs404SecretUnlocked(false);
      setIs404SecretActive(false);
    }
    else if (id === AchievementId.oceangate) {
      setIsOceangateSecretUnlocked(false);
      setIsOceangateSecretActive(false);
    }
    else if (id === AchievementId.android) {
      setIsAndroidSecretUnlocked(false);
      setIsAndroidSecretActive(false);
    }
    else if (id === AchievementId.missing_no) {
      setIsMissingNoSecretUnlocked(false);
      setIsMissingNoSecretActive(false);
    }
    else {
      // if any enum case is missed, TypeScript flags an error here
      const exhaustiveCheck: never = id;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }, [isKonamiSecretUnlocked, isPspSecretUnlocked, isIwhbydSecretUnlocked, isAndroidSecretUnlocked, isMissingNoSecretUnlocked, isOceangateSecretUnlocked, is404SecretUnlocked]);


  const unlockSecret = useCallback(async (id: AchievementId) => {

    // check to see if it has already been unlocked
    const isUnlocked = isSecretUnlocked(id);
    if (isUnlocked) return;

    // save that it's unlocked and enabled automatically
    setSecretUnlocked(id, true);
    setSecretEnabled(id, true);

    const secret = secrets[id];
    showSnackbar(`Secret ${secret.title} Unlocked`, secret.description, 'unlock');

    play(SECRET_AUDIO_SRC);

    if (id === AchievementId.konami_code) {
      setIsKonamiSecretUnlocked(true);
      setIsKonamiSecretActive(true);
    }
    else if (id === AchievementId.psp_code) {
      setIsPspSecretUnlocked(true);
      setIsPspSecretActive(true);
    }
    else if (id === AchievementId.iwhbyd) {
      setIsIwhbydSecretUnlocked(true);
      setIsIwhbydSecretActive(true);
    }
    else if (id === AchievementId._404) {
      setIs404SecretUnlocked(true);
      setIs404SecretActive(true);
    }
    else if (id === AchievementId.oceangate) {
      setIsOceangateSecretUnlocked(true);
      setIsOceangateSecretActive(true);
    }
    else if (id === AchievementId.android) {
      setIsAndroidSecretUnlocked(true);
      setIsAndroidSecretActive(true);
    }
    else if (id === AchievementId.missing_no) {
      setIsMissingNoSecretUnlocked(true);
      setIsMissingNoSecretActive(true);
    }
    else {
      // if any enum case is missed, TypeScript flags an error here
      const exhaustiveCheck: never = id;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }, [isKonamiSecretUnlocked, isPspSecretUnlocked, isIwhbydSecretUnlocked, isAndroidSecretUnlocked, isMissingNoSecretUnlocked, isOceangateSecretUnlocked, is404SecretUnlocked]);

  const toggleSecret = useCallback(async (id: AchievementId) => {

    // make sure that it has been unlocked first
    // TODO: conisder throwing error here if not unlocked
    const isUnlocked = isSecretUnlocked(id);
    if (!isUnlocked) return;

    const isEnabled = isSecretEnabled(id);
    const newState = !isEnabled;

    const action = newState ? 'Enabled' : 'Disabled';
    const variant: SnackbarVariant = newState ? 'enable' : 'disable';

    showSnackbar(`Secret ${id} ${action}`, variant);

    // save the new setting value
    setSecretEnabled(id, newState);

    if (id === AchievementId.konami_code) setIsKonamiSecretActive(newState);
    else if (id === AchievementId.psp_code) setIsPspSecretActive(newState);
    else if (id === AchievementId.iwhbyd) setIsIwhbydSecretActive(newState);
    else if (id === AchievementId._404) setIs404SecretActive(newState);
    else if (id === AchievementId.oceangate) setIsOceangateSecretActive(newState);
    else if (id === AchievementId.android) setIsAndroidSecretActive(newState);
    else if (id === AchievementId.missing_no) setIsMissingNoSecretActive(newState);
    else {
      // if any enum case is missed, TypeScript flags an error here
      const exhaustiveCheck: never = id;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }, [stats]);

  const refreshStats = () => {
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
  };

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

    isSecretUnlocked,
    setSecretUnlocked,
    isSecretEnabled,
    setSecretEnabled,
    lockSecret,
    unlockSecret,
    toggleSecret,
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

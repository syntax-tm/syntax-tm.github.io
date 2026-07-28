"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAudio } from '@context/AudioContext';
import { useSnackbar } from "@context/SnackbarContext";
import { useGamepads } from 'awesome-react-gamepads';
import { useKeySequence } from "@hooks/useKeySequence";
import { tryParseJSONObject } from "@services/utils";
import localFont from "next/font/local";

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

export interface Stat {
  id: AchievementId;
  title: string;
  description?: string;
  // TODO: add icon for locked/unlocked
  // TODO: add a hint indicating how this can be unlocked
}

export interface AchievementStatSchema {
  id: AchievementId;
  isUnlocked: boolean,
  dateUnlocked?: Date | null,
};

export interface PlayerStat {
  id: AchievementId;
  stat: Stat;
  isUnlocked: boolean;
  dateUnlocked: Date | null;
}

export type SecretMap = Record<AchievementId, Stat>;

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
  isKonamiSecretActive: boolean;
  isPspSecretActive: boolean;
  isIwhbydActive: boolean;
  is404SecretActive: boolean;
  isOceangateSecretActive: boolean;
  isAndroidSecretActive: boolean;
  isMissingNoSecretActive: boolean;
  toggleSecret: (id: AchievementId) => Promise<void>;
  secrets: Record<AchievementId, Stat>;
  stats: Map<AchievementId, PlayerStat> | null;
  pspFontClass: string;
  //loadPlayerStats: () => Map<AchievementId, PlayerStat>;
}

const SecretContext = createContext<SecretContextType | undefined>(undefined);

export function SecretProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Map<AchievementId, PlayerStat> | null>(null);
  const [isKonamiSecretActive, setIsKonamiSecretActive] = useState(false);
  const [isPspSecretActive, setIsPspSecretActive] = useState(false);
  const [isIwhbydActive, setIsIwhbydActive] = useState(false);
  const [is404SecretActive, setIs404SecretActive] = useState(false);
  const [isOceangateSecretActive, setIsOceangateSecretActive] = useState(false);
  const [isAndroidSecretActive, setIsAndroidSecretActive] = useState(false);
  const [isMissingNoSecretActive, setIsMissingNoSecretActive] = useState(false);
  const { play } = useAudio();
  const { showSnackbar } = useSnackbar();

  const getSecretStat = useCallback((id: AchievementId) => {
    // does not exist
    if (!localStorage.getItem(id.toString())) {
      const def: AchievementStatSchema = {
        id,
        isUnlocked: false,
      };
      return def;
    }

    const loadedStat = localStorage.getItem(id.toString());
    if (!loadedStat) throw new Error(`Unable to load the stats for ${id}.`);

    try {
      const savedStat: AchievementStatSchema = JSON.parse(loadedStat);
      return savedStat;
    }
    catch {

      // reset the achievement state in case it was corrupted
      saveSecretStat(id, false, true);

      return {
        id,
        isUnlocked: false,
        dateUnlocked: null,
      } as AchievementStatSchema;
    }
  }, []);

  const saveSecretStat = useCallback((id: AchievementId, isUnlocked: boolean = true, overwrite: boolean = false) => {
    const statValue: AchievementStatSchema = {
      id,
      isUnlocked,
      dateUnlocked: isUnlocked ? new Date() : null,
    };

    // if this is already in storage, don't overwrite it (only if it's unlocked)
    const statText = localStorage.getItem(id.toString());
    if (statText) {
      const result = tryParseJSONObject(statText) as AchievementStatSchema;
      if (!result) {
        console.warn(`Unable to load current stat for ${id}.`);
      }
      else if (result.isUnlocked && !overwrite) {
        return;
      }
    }

    localStorage.setItem(id.toString(), JSON.stringify(statValue, null, 0));
  }, []);

  const toggleSecret = useCallback(async (id: AchievementId) => {
    saveSecretStat(id, true);

    await play(SECRET_AUDIO_SRC);

    const state = stats?.get(id);

    if (!state) return;

    const newState = !state.isUnlocked;

    const action = newState ? 'Unlocked' : 'Locked';

    showSnackbar(`Secret ${action}`, state?.stat.title, 'success');

    switch (id) {
      case AchievementId.konami_code: {
        setIsKonamiSecretActive(newState);
        break;
      }
      case AchievementId.psp_code: {
        setIsPspSecretActive(newState);
        break;
      }
      case AchievementId.iwhbyd: {
        setIsIwhbydActive(newState);
        break;
      }
      case AchievementId._404: {
        setIs404SecretActive(newState);
        break;
      }
      case AchievementId.oceangate: {
        setIsOceangateSecretActive(newState);
        break;
      }
      case AchievementId.android: {
        setIsAndroidSecretActive(newState);
        break;
      }
      case AchievementId.missing_no: {
        setIsMissingNoSecretActive(newState);
        break;
      }
      default: {
        // if any enum case is missed, TypeScript flags an error here
        const exhaustiveCheck: never = id;
        throw new Error(`Unhandled case: ${exhaustiveCheck}`);
      }
    }
  }, [stats]);

  useKeySequence(KONAMI_CODE, () => {
    toggleSecret(AchievementId.konami_code);
  });

  useKeySequence(PSP, () => {
    toggleSecret(AchievementId.psp_code);
  });

  useKeySequence(IWHBYD_CODE, () => {
    toggleSecret(AchievementId.iwhbyd);
  });

  useGamepads({
    onConnect: () => {
      toggleSecret(AchievementId.oceangate);
    },
    onKonamiSuccess: () => {
      toggleSecret(AchievementId.konami_code);
    },
  });

  useEffect(() => {

    const playerStats = new Map<AchievementId, PlayerStat>();
    Object.keys(AchievementId)
      //.filter(v => typeof v !== "string")
      //.filter(v => !isNaN(Number(v)))
      .map((id) => {
        const achId = AchievementId[id as keyof typeof AchievementId];
        const playerStat: PlayerStat = {
          id: achId,
          isUnlocked: getSecretStat(achId)?.isUnlocked ?? false,
          stat: secrets[achId],
          dateUnlocked: null,
        };
        playerStats.set(achId, playerStat);
      });

    setStats(playerStats);

    setIsKonamiSecretActive(playerStats.get(AchievementId.konami_code)?.isUnlocked ?? false);
    setIsPspSecretActive(playerStats.get(AchievementId.psp_code)?.isUnlocked ?? false);
    setIs404SecretActive(playerStats.get(AchievementId._404)?.isUnlocked ?? false);
    setIsAndroidSecretActive(playerStats.get(AchievementId.android)?.isUnlocked ?? false);
    setIsOceangateSecretActive(playerStats.get(AchievementId.oceangate)?.isUnlocked ?? false);
    setIsMissingNoSecretActive(playerStats.get(AchievementId.missing_no)?.isUnlocked ?? false);
    setIsIwhbydActive(playerStats.get(AchievementId.iwhbyd)?.isUnlocked ?? false);
  }, []);

  useEffect(() => {
    const handleSecretActivate = () => {
      void toggleSecret(AchievementId.konami_code);
    };

    const handlePspSecretActivate = () => {
      void toggleSecret(AchievementId.psp_code);
    };

    const handleOceangateSecretActivate = () => {
      void toggleSecret(AchievementId.oceangate);
    };

    const handle404SecretActivate = () => {
      void toggleSecret(AchievementId._404);
    };

    const handleIwhbydSecretActivate = () => {
      void toggleSecret(AchievementId.iwhbyd);
    };

    const handleMissingNoSecretActivate = () => {
      void toggleSecret(AchievementId.missing_no);
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

  const value = useMemo(
    () => ({
      isKonamiSecretActive,
      isPspSecretActive,
      isIwhbydActive,
      is404SecretActive,
      isOceangateSecretActive,
      isAndroidSecretActive,
      isMissingNoSecretActive,
      toggleSecret,
      secrets,
      stats,
      pspFontClass: pspFont.className,
    }),
    [isKonamiSecretActive, isPspSecretActive, isIwhbydActive,
      is404SecretActive, isOceangateSecretActive, isAndroidSecretActive,
      isMissingNoSecretActive, toggleSecret, stats],
  );

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

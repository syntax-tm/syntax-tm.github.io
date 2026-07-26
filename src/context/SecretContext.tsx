"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAudio } from '@context/AudioContext';
import { useSnackbar } from "@context/SnackbarContext";
import { useGamepads } from 'awesome-react-gamepads';
import { useKeySequence } from "@hooks/useKeySequence";

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
  konami_code,
  psp_code,
  iwhbyd,
  oceangate,
  _404,
  android,
  missing_no,
};

export interface Stat {
  id: AchievementId;
  title: string;
  description?: string;
  // TODO: add icon for locked/unlocked
  // TODO: add a hint indicating how this can be unlocked
}

interface AchievementStatSchema {
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
    description: 'Entered the Konami Code using a keyboard or a controller.',
  },
  [AchievementId.psp_code]: {
    id: AchievementId.psp_code,
    title: 'PSP Code',
    description: 'Entered "PSP" using a keyboard to activate the PSP background.',
  },
  [AchievementId._404]: {
    id: AchievementId._404,
    title: 'Four-oh-Four',
    description: "There was a page here, but it's gone now.",
  },
  [AchievementId.iwhbyd]: {
    id: AchievementId.iwhbyd,
    title: 'I Would Have Been Your Daddy',
    description: "Entered the elusive IWHBYD code using a keyboard or a controller.",
  },
  [AchievementId.oceangate]: {
    id: AchievementId.oceangate,
    title: 'I Can Haz Controller',
    description: "Not only did you connect a controller to your device, you went the extra mile to use it to navigate this overly-engineered personal website.",
  },
  [AchievementId.android]: {
    id: AchievementId.android,
    title: 'Just Like Google',
    description: "Your familiarity with Google's Android easter egg activation has finally paid off (just not in money).",
  },
  [AchievementId.missing_no]: {
    id: AchievementId.missing_no,
    title: 'MissingNo.',
    description: "MissingNo. is a glitch and an unofficial Pokémon species found in the video games Pokémon Red and Blue. Due to the programming of certain in-game events, players can encounter MissingNo. via a glitch.",
  },
};

interface SecretContextType {
  isKonamiSecretActive: boolean;
  isPspSecretActive: boolean;
  isIwhbydActive: boolean;
  is404SecretActive: boolean;
  isOceangateSecretActive: boolean;
  isAndroidSecretActive: boolean;
  isMissingNoSecretActive: boolean;
  toggleSecret: (id: AchievementId) => Promise<void>;
  secrets: Record<AchievementId, Stat>;
  stats: Map<AchievementId, PlayerStat>;
  loadPlayerStats: () => Map<AchievementId, PlayerStat>;
}

const getSecretStat = (id: AchievementId) => {
  // if it does not exist, save the current state
  if (!localStorage.getItem(id.toString())) {
    saveSecretStat(id, false);
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
};

const saveSecretStat = (id: AchievementId, isUnlocked: boolean = true, overwrite: boolean = false) => {
  // if this is already in storage, don't overwrite it (only if it's unlocked)
  const statText = localStorage.getItem(id.toString());
  if (statText) {
    const currentStat: AchievementStatSchema = JSON.parse(statText);
    if (currentStat && currentStat.isUnlocked && !overwrite) {
      return;
    }
  }

  const statValue: AchievementStatSchema = {
    id,
    isUnlocked,
    dateUnlocked: new Date(),
  };
  localStorage.setItem(id.toString(), JSON.stringify(statValue, null, 0));
};

const loadPlayerStats = () => {
  const results = new Map<AchievementId, PlayerStat>();
  Object.keys(AchievementId)
    .map((id) => {
      const achId = AchievementId[id as keyof typeof AchievementId];
      const playerStat: PlayerStat = {
        id: achId,
        isUnlocked: getSecretStat(achId).isUnlocked,
        stat: secrets[achId],
        dateUnlocked: null,
      };
      results.set(achId, playerStat);
    });

  return results;
};

const SecretContext = createContext<SecretContextType | undefined>(undefined);

export function SecretProvider({ children }: { children: React.ReactNode }) {
  const stats = useRef<Map<AchievementId, PlayerStat>>(loadPlayerStats());
  const [isKonamiSecretActive, setIsKonamiSecretActive] = useState(stats.current.get(AchievementId.konami_code)?.isUnlocked ?? false);
  const [isPspSecretActive, setIsPspSecretActive] = useState(stats.current.get(AchievementId.psp_code)?.isUnlocked ?? false);
  const [isIwhbydActive, setIsIwhbydActive] = useState(stats.current.get(AchievementId.iwhbyd)?.isUnlocked ?? false);
  const [is404SecretActive, setIs404SecretActive] = useState(stats.current.get(AchievementId._404)?.isUnlocked ?? false);
  const [isOceangateSecretActive, setIsOceangateSecretActive] = useState(stats.current.get(AchievementId.oceangate)?.isUnlocked ?? false);
  const [isAndroidSecretActive, setIsAndroidSecretActive] = useState(stats.current.get(AchievementId.android)?.isUnlocked ?? false);
  const [isMissingNoSecretActive, setIsMissingNoSecretActive] = useState(stats.current.get(AchievementId.missing_no)?.isUnlocked ?? false);
  const { play } = useAudio();
  const { showSnackbar } = useSnackbar();

  const toggleSecret = useCallback(async (id: AchievementId) => {
    saveSecretStat(id, true);

    await play(SECRET_AUDIO_SRC);

    const state = stats.current.get(id);

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
  }, [setIsKonamiSecretActive, setIsPspSecretActive, setIsIwhbydActive, setIs404SecretActive,
    setIsOceangateSecretActive, setIsAndroidSecretActive, setIsMissingNoSecretActive]);

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

    return () => {
      document.removeEventListener("secret:konami:activate", handleSecretActivate);
      document.removeEventListener("secret:psp:activate", handlePspSecretActivate);
      document.removeEventListener("secret:oceangate:activate", handleOceangateSecretActivate);
      document.removeEventListener("secret:404:activate", handle404SecretActivate);
      document.removeEventListener("secret:iwhbyd:activate", handleIwhbydSecretActivate);
      document.removeEventListener("secret:missing_no:activate", handleMissingNoSecretActivate);
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
      stats: stats.current,
      loadPlayerStats,
    }),
    [isKonamiSecretActive, isPspSecretActive, isIwhbydActive,
      is404SecretActive, isOceangateSecretActive, isAndroidSecretActive,
      isMissingNoSecretActive, toggleSecret],
  );

  return (
    <SecretContext.Provider value={value}>
      {children}
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

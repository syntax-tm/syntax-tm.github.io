"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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

interface SecretContextType {
  isSecretActive: boolean;
  toggleSecret: () => Promise<void>;
}

const SecretContext = createContext<SecretContextType | undefined>(undefined);

export function SecretProvider({ children }: { children: React.ReactNode }) {
  const [isSecretActive, setIsSecretActive] = useState(false);
  const { play } = useAudio();
  const { showSnackbar } = useSnackbar();

  const toggleSecret = useCallback(async () => {
    const newState = !isSecretActive;
    setIsSecretActive(newState);
    await play(SECRET_AUDIO_SRC);
    const message = newState ? 'activated' : 'deactivated';
    showSnackbar(`Secret ${message}.`, 'success');
  }, [isSecretActive, play, showSnackbar]);

  useKeySequence(KONAMI_CODE, () => {
    toggleSecret();
  });

  useGamepads({
    onKonamiSuccess: () => {
      toggleSecret();
    },
  });

  useEffect(() => {
    const handleSecretActivate = () => {
      void toggleSecret();
    };

    window.addEventListener("secret:activate", handleSecretActivate);

    return () => {
      window.removeEventListener("secret:activate", handleSecretActivate);
    };
  }, [toggleSecret]);

  const value = useMemo(
    () => ({
      isSecretActive,
      toggleSecret,
    }),
    [isSecretActive, toggleSecret],
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

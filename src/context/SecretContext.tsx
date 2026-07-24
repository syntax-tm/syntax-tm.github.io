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
const PSP = [
  "p", "s", "p",
];

interface SecretContextType {
  isSecretActive: boolean;
  isPspSecretActive: boolean;
  toggleSecret: () => Promise<void>;
  togglePspSecret: () => Promise<void>;
}

const SecretContext = createContext<SecretContextType | undefined>(undefined);

export function SecretProvider({ children }: { children: React.ReactNode }) {
  const [isSecretActive, setIsSecretActive] = useState(false);
  const [isPspSecretActive, setIsPspSecretActive] = useState(false);
  const { play } = useAudio();
  const { showSnackbar } = useSnackbar();

  const toggleSecret = useCallback(async () => {
    const newState = !isSecretActive;
    setIsSecretActive(newState);
    await play(SECRET_AUDIO_SRC);
    const message = newState ? 'activated' : 'deactivated';
    showSnackbar(`Secret ${message}.`, 'success');
  }, [isSecretActive]);

  const togglePspSecret = useCallback(async () => {
    const newState = !isPspSecretActive;
    setIsPspSecretActive(newState);
    await play(SECRET_AUDIO_SRC);
    const message = newState ? 'activated' : 'deactivated';
    showSnackbar(`PSP secret ${message}.`, 'success');
  }, [isPspSecretActive]);

  useKeySequence(KONAMI_CODE, () => {
    toggleSecret();
  });

  useKeySequence(PSP, () => {
    togglePspSecret();
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

    const handlePspSecretActivate = () => {
      void togglePspSecret();
    };

    document.addEventListener("secret:activate", handleSecretActivate);
    document.addEventListener("pspsecret:activate", handlePspSecretActivate);

    return () => {
      document.removeEventListener("secret:activate", handleSecretActivate);
      document.removeEventListener("pspsecret:activate", handlePspSecretActivate);
    };
  }, [toggleSecret, togglePspSecret]);

  const value = useMemo(
    () => ({
      isSecretActive,
      isPspSecretActive,
      toggleSecret,
      togglePspSecret,
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

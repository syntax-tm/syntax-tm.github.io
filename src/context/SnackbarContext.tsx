"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { faInfoCircle, faExclamationCircle, IconDefinition, faCheckCircle, faEgg } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAudio } from '@context/AudioContext';
import { SnackbarVariant } from '@components/types';

const SNACKBAR_AUDIO_SRC = '/audio/snd_system_ok.wav';
const DEFAULT_TIMEOUT = 8000;

interface SnackbarContextType {
  showSnackbar: (message: string, description?: string, variant?: SnackbarVariant) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [snackbar, setSnackbar] = useState<{ message: string, description: string; variant: SnackbarVariant; isOpen: boolean }>({
    message: "",
    description: "",
    variant: "info",
    isOpen: false,
  });

  //const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { play } = useAudio();

  const showSnackbar = async (message: string, description: string = '', variant: SnackbarVariant = "info", timeout: number = DEFAULT_TIMEOUT) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setSnackbar({ message, description, variant, isOpen: true });

    if (variant !== 'secret') {
      play(SNACKBAR_AUDIO_SRC);
    }

    timerRef.current = setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, isOpen: false }));
    }, timeout);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  let icon: IconDefinition;

  if (snackbar.variant === "info") { icon = faInfoCircle; }
  else if (snackbar.variant === "error") { icon = faExclamationCircle; }
  else if (snackbar.variant === "success") { icon = faCheckCircle; }
  else if (snackbar.variant === "secret") { icon = faEgg; }
  else { icon = faInfoCircle; }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar.isOpen && (
        <>
          <div className="fixed top-5 right-5 z-50 animate-fade-in-up h-auto max-w-4/5 md:max-w-2/5"
            onClick={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}>
            <div className={`px-2 py-2 rounded-lg text-white bg-gray-500 flex relative min-h-15`}>
              <FontAwesomeIcon icon={icon} className="mr-2 my-auto w-auto text-3xl z-10" />
              <div className="flex flex-col align-middle">
                <span className="inline-block align-middle my-auto text-balance mr-2">{snackbar.message}</span>
                {snackbar.description && (
                  <>
                    <span className="inline-block align-middle my-auto text-balance mr-2">{snackbar.description}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error("useSnackbar must be used within a SnackbarProvider");
  return context;
};

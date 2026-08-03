"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { faInfoCircle, faExclamationCircle, faWarning, IconDefinition, faCheckCircle, faEgg, faLock, faUnlock, faCheck, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAudio } from '@context/AudioContext';
import { SnackbarVariant } from '@components/types';

const SNACKBAR_AUDIO_SRC = '/audio/snd_system_ok.wav';
const DEFAULT_TIMEOUT = 8000;
const DARK_TEXT_COLOR = 'text-zinc-800';

interface SnackbarContextType {
  showSnackbar: (message: string, description?: string, variant?: SnackbarVariant) => void;
}

const SECRET_VARIANTS: SnackbarVariant[] = ['secret', 'lock', 'unlock', 'enable', 'disable'];

const isSecretVariant = (variant: SnackbarVariant) => {
  return SECRET_VARIANTS.find(v => v === variant);
};

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

    if (!isSecretVariant(variant)) {
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
  let bg: string;
  let fg: string = 'text-white';

  if (snackbar.variant === "info") { icon = faInfoCircle; bg = 'bg-blue-300'; }
  else if (snackbar.variant === "error") { icon = faExclamationCircle; bg = 'bg-red-300'; }
  else if (snackbar.variant === "warn") { icon = faWarning; bg = 'bg-yellow-300'; fg = DARK_TEXT_COLOR; }
  else if (snackbar.variant === "success") { icon = faCheckCircle; bg = 'bg-green-300'; fg = DARK_TEXT_COLOR; }
  else if (snackbar.variant === "secret") { icon = faEgg; bg = 'bg-blue-500'; }
  else if (snackbar.variant === "lock") { icon = faLock; bg = 'bg-yellow-300'; fg = DARK_TEXT_COLOR; }
  else if (snackbar.variant === "unlock") { icon = faUnlock; bg = 'bg-blue-500'; }
  else if (snackbar.variant === "enable") { icon = faCheck; bg = 'bg-green-300'; }
  else if (snackbar.variant === "disable") { icon = faMinus; bg = 'bg-gray-200'; fg = DARK_TEXT_COLOR; }
  else { icon = faInfoCircle; bg = 'bg-blue-400'; }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar.isOpen && (
        <>
          <div className="fixed top-5 right-5 z-100 animate-fade-in-up h-auto max-w-3/5 lg:max-w-2/5"
            onClick={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}>
            <div className={`px-2 py-2 rounded-md ${fg} ${bg} flex relative min-h-15`}>
              <FontAwesomeIcon icon={icon} className="mr-2 my-auto w-auto lg:text-3xl z-10" />
              <div className="flex flex-col align-middle">
                <span className="inline-block align-middle my-auto text-balance mr-2 text-[11pt] lg:text-[14pt]">{snackbar.message}</span>
                {snackbar.description && (
                  <>
                    {/* <hr className={`my-1 opacity-70 ${fg === 'text-zinc-800' && 'border-black/80'}`} /> */}
                    <span className="text-[9pt] lg:text-[10pt] inline-block align-middle my-auto text-wrap mr-2">{snackbar.description}</span>
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

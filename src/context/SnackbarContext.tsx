"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { faInfoCircle, faExclamationCircle, faWarning, IconDefinition, faCheckCircle, faEgg, faLock, faUnlock, faCheck, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAudio } from "@context/AudioContext";
import { SnackbarVariant } from "types";
import PlatinumTrophy from "image/trophy/platinum.png";
import "@styles/components/snackbar.scss";
import Image from "next/image";

const SNACKBAR_AUDIO_SRC = '/audio/snd_system_ok.wav';
const DEFAULT_TIMEOUT = 800000;

interface SnackbarContextType {
  showSnackbar: (message: string, description?: string, variant?: SnackbarVariant, audioSrc?: string | null) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [snackbar, setSnackbar] = useState<{ message: string, description: string; variant: SnackbarVariant, audioSrc: string | null; isOpen: boolean }>({
    message: "",
    description: "",
    variant: "info",
    audioSrc: SNACKBAR_AUDIO_SRC,
    isOpen: false,
  });

  //const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { play } = useAudio();

  const showSnackbar = (message: string, description: string = '', variant: SnackbarVariant = "info", audioSrc: string | null = SNACKBAR_AUDIO_SRC, timeout: number = DEFAULT_TIMEOUT) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setSnackbar({ message, description, variant, audioSrc, isOpen: true });

    if (audioSrc) {
      void play(audioSrc);
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

  let icon: React.ReactNode;

  if (snackbar.variant === "unlock") {
    icon = <Image src={PlatinumTrophy} alt="Platinum Trophy" className="icon snackbar-icon mr-2 my-auto lg:text-3xl" />;
  }
  else {
    let kind: IconDefinition;
    if (snackbar.variant === "info") { kind = faInfoCircle; }
    else if (snackbar.variant === "error") { kind = faExclamationCircle; }
    else if (snackbar.variant === "warn") { kind = faWarning; }
    else if (snackbar.variant === "success") { kind = faCheckCircle; }
    else if (snackbar.variant === "secret") { kind = faEgg; }
    else if (snackbar.variant === "lock") { kind = faLock; }
    else if (snackbar.variant === "enable") { kind = faCheck; }
    else if (snackbar.variant === "disable") { kind = faMinus; }
    else { kind = faInfoCircle; }

    icon = <FontAwesomeIcon icon={kind} className="icon snackbar-icon mr-2 my-auto lg:text-3xl" />;
  }


  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar.isOpen && (
        <>
          <div className={`snackbar snackbar-${snackbar.variant} fixed top-5 right-5 z-100 animate-fade-in-up h-auto max-w-3/5 lg:max-w-2/5 min-w-[250px] lg:min-w-[300px]`}
            onClick={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}>
            <div className={`snackbar-${snackbar.variant} flex my-auto pl-3 mr-4 rounded-md relative min-h-15 w-auto`}>
              {icon}
              <div className="snackbar-text-container flex flex-col align-middle p-2">
                <span className="snackbar-title inline-block align-middle my-auto text-balance mr-2 text-[11pt] lg:text-[16pt]">{snackbar.message}</span>
                {snackbar.description && (
                  <>
                    {/* <hr className={`my-1 opacity-70 ${fg === 'text-zinc-800' && 'border-black/80'}`} /> */}
                    <span className="snackbar-content text-[9pt] lg:text-[12pt] inline-block align-middle my-auto text-wrap mr-2">{snackbar.description}</span>
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

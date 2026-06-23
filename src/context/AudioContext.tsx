"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";

interface AudioContextType {
  isPlaying: boolean;
  play: (src: string) => void;
  currentTrack: string | null;
  pause: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  useEffect(() => {
    // initialize Audio only on the client side
    audioRef.current = new Audio();

    // track when audio finishes playing naturally
    const handleEnded = () => setIsPlaying(false);
    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener("ended", handleEnded);
    };
  }, []);

  const play = (src: string) => {
    if (!audioRef.current) return;

    // if it's a new sound source, update it
    if (currentTrack !== src) {
      audioRef.current.src = src;
      setCurrentTrack(src);
    }

    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.error("Audio playback blocked by browser policy:", err));
  };

  const pause = () => {
    if (!audioRef.current || !currentTrack) return;

    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider value={{ isPlaying, play, pause, currentTrack }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within an AudioProvider");
  return context;
}

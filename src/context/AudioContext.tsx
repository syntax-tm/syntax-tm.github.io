"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";

interface AudioContextType {
  isPlaying: boolean;
  play: (src: string) => void;
  pause: () => void;
  currentTrack: string | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // useEffect(() => {
  //   // initialize Audio only on the client side
  //   audioRef.current = new Audio();

  //   return () => {
  //     if (audioRef.current) {
  //       audioRef.current.pause();
  //       audioRef.current.src = '';
  //     }
  //   };

  //   // // track when audio finishes playing naturally
  //   // const handleEnded = () => setIsPlaying(false);
  //   // audioRef.current.addEventListener("ended", handleEnded);

  //   // return () => {
  //   //   audioRef.current?.removeEventListener("ended", handleEnded);
  //   //   audioRef.current?.pause();
  //   // };
  // }, []);

  const play = async (src: string) => {

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch (e) {
        // ignore interrupted play errors from previous actions
        console.error('Audio playback failed', e);
      }
    }

    const audio = audioRef.current;

    if (!audio) return;

    if (currentTrack !== src) {
      audio.pause();
      audio.src = src;
      setCurrentTrack(src);
    }

    playPromiseRef.current = audio.play()
      .catch((err) => {
        console.error("Audio playback blocked by browser policy:", err);
        setIsPlaying(false);
        setCurrentTrack(null);
      });

    setIsPlaying(true);

    // return new Promise<void>((resolve) => {
    //   const audio = audioRef.current;

    //   if (!audio) return resolve();

    //   audio.pause();
    //   audio.src = src;
    //   audio.load();

    //   audio.onended = () => {
    //     setIsPlaying(false);
    //     setCurrentTrack(null);
    //     resolve(); // resolves the promise when the audio finishes
    //   };

    //   audio.onerror = (e) => {
    //     setIsPlaying(false);
    //     setCurrentTrack(null);
    //     console.error('Audio playback failed', e);
    //     resolve(); // resolve anyway to prevent hanging on error
    //   };

    //   setIsPlaying(true);

    //   audio.play()
    //     .catch((err) => {
    //       console.error("Audio playback blocked by browser policy:", err);
    //       setIsPlaying(false);
    //       setCurrentTrack(null);
    //       resolve();
    //     });

    // });
  };

  const pause = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
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

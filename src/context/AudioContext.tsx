"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  isPlaying: boolean;
  play: (src: string) => Promise<void>;
  pause: () => void;
  currentTrack: string | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Record<string, AudioBuffer>>({});
  const bufferPromisesRef = useRef<Record<string, Promise<AudioBuffer>>>({});
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) {
      console.warn("Web Audio API is not supported in this browser.");
      return;
    }

    audioContextRef.current = new AudioContextCtor();

    return () => {
      activeSourcesRef.current.forEach((source) => {
        try {
          source.stop();
        } catch {
          // ignore already-stopped nodes
        }
      });
      activeSourcesRef.current = [];
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, []);

  const getBuffer = async (src: string) => {
    const existing = buffersRef.current[src];
    if (existing) return existing;

    if (bufferPromisesRef.current[src]) {
      return bufferPromisesRef.current[src];
    }

    const loadPromise = (async () => {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to load audio: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const context = audioContextRef.current;
      if (!context) {
        throw new Error("Audio context is not available");
      }

      const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
      buffersRef.current[src] = audioBuffer;
      return audioBuffer;
    })();

    bufferPromisesRef.current[src] = loadPromise;

    try {
      return await loadPromise;
    } finally {
      delete bufferPromisesRef.current[src];
    }
  };

  const play = async (src: string) => {
    const context = audioContextRef.current;
    if (!context) return;

    if (context.state === "suspended") {
      await context.resume();
    }

    try {
      const buffer = await getBuffer(src);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter((activeSource) => activeSource !== source);
        if (activeSourcesRef.current.length === 0) {
          setIsPlaying(false);
        }
      };

      source.start(0);
      activeSourcesRef.current.push(source);
      setCurrentTrack(src);
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  };

  const pause = () => {
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch {
        // ignore already-stopped nodes
      }
    });
    activeSourcesRef.current = [];
    setIsPlaying(false);
    setCurrentTrack(null);
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

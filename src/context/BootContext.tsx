"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import usePath from "@hooks/usePath";
import { useAudio, useTheme } from "@context";

const DEFAULT_BOOT_DURATION = 5000;
const DEFAULT_IS_INDEFINITE = false;

interface BootContextType {
  isBootVisible: boolean;
  isBootTransitioningOut: boolean;
  isIndefinite: boolean;
  showBootScreen: () => void;
  hideBootScreen: () => void;
  pauseBoot: () => void;
}

const BootContext = createContext<BootContextType | undefined>(undefined);

export function BootProvider({ children }: { children: React.ReactNode }) {
  const bootShownRef = useRef(false);
  const fadeOutTimerRef = useRef(0);
  const hideTimerRef = useRef(0);
  const [isBootVisible, setIsBootVisible] = useState(true);
  const [isBootTransitioningOut, setIsBootTransitioningOut] = useState(false);
  const { modal } = usePath();
  const { boot } = useTheme();
  const { pause } = useAudio();
  const [isIndefinite, setIsIndefinite] = useState(DEFAULT_IS_INDEFINITE);

  // disables boot screen on any modal (to allow directly linking to them without the boot animation)
  if (modal)
    bootShownRef.current = true;

  const showBootScreen = useCallback(() => {
    bootShownRef.current = false;
    setIsBootVisible(true);
    setIsBootTransitioningOut(false);
  }, []);

  const hideBootScreen = useCallback(() => {
    setIsBootTransitioningOut(false);
    setIsBootVisible(false);
    pause();
    bootShownRef.current = true;
  }, [pause]);

  const pauseBoot = useCallback(() => {
    console.log(``);

    setIsIndefinite(true);
  }, []);

  useEffect(() => {
    if (!isBootVisible) return;

    const bootDuration = boot?.bootDuration ?? DEFAULT_BOOT_DURATION;
    const fadeOutDuration = boot?.bootFadeOutDuration ?? 0;
    const indefinite = bootDuration <= 0;

    setIsIndefinite(indefinite);

    // allow indefinite boot (requires call to hideBootScreen())
    if (indefinite) {
      return;
    }

    fadeOutTimerRef.current = window.setTimeout(() => {
      setIsBootTransitioningOut(true);
    }, bootDuration - fadeOutDuration);

    hideTimerRef.current = window.setTimeout(() => {
      hideBootScreen();
      bootShownRef.current = true;
    }, bootDuration);

    return () => {
      if (fadeOutTimerRef.current)
        window.clearTimeout(fadeOutTimerRef.current);
      if (hideTimerRef.current)
        window.clearTimeout(hideTimerRef.current);
    };
  }, [isBootVisible, boot]);

  const value: BootContextType = useMemo(() => {
    return {
      isBootVisible,
      isBootTransitioningOut,
      isIndefinite,
      showBootScreen,
      hideBootScreen,
      pauseBoot,
    };
  }, [isBootVisible, isBootTransitioningOut]);

  return <BootContext.Provider value={value}>
    {children}
  </BootContext.Provider>;
}

export function useBoot() {
  const context = useContext(BootContext);

  if (!context) {
    throw new Error("useBoot must be used within a BootProvider");
  }

  return context;
}

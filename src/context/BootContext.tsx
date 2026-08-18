"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import usePath from "@hooks/usePath";
import { useAudio, useTheme } from "@context";

interface BootContextType {
  isBootVisible: boolean;
  isBootTransitioningOut: boolean;
  showBootScreen: () => void;
  hideBootScreen: () => void;
}

const BootContext = createContext<BootContextType | undefined>(undefined);

export function BootProvider({ children }: { children: React.ReactNode }) {
  const bootShownRef = useRef(false);
  const [isBootVisible, setIsBootVisible] = useState(true);
  const [isBootTransitioningOut, setIsBootTransitioningOut] = useState(false);
  const { modal } = usePath();
  const { boot } = useTheme();
  const { pause } = useAudio();

  // disables boot screen on any modal (to allow directly linking to them without the boot animation)
  if (modal)
    bootShownRef.current = true;

  const showBootScreen = useCallback(() => {
    setIsBootVisible(true);
    setIsBootTransitioningOut(false);
  }, []);

  const hideBootScreen = useCallback(() => {
    setIsBootTransitioningOut(false);
    setIsBootVisible(false);
    pause();
    bootShownRef.current = true;
  }, [pause]);

  useEffect(() => {
    if (!isBootVisible) return;

    const bootDuration = boot?.bootDuration ?? 5000;
    const fadeOutDuration = boot?.bootFadeOutDuration ?? 0;

    //if (!boot) return;

    const fadeOutTimer = window.setTimeout(() => {
      setIsBootTransitioningOut(true);
    }, bootDuration - fadeOutDuration);

    const hideTimer = window.setTimeout(() => {
      hideBootScreen();
      bootShownRef.current = true;
    }, bootDuration);

    return () => {
      window.clearTimeout(fadeOutTimer);
      window.clearTimeout(hideTimer);
    };
  }, [isBootVisible, boot]);

  const value: BootContextType = useMemo(() => {
    return {
      isBootVisible,
      isBootTransitioningOut,
      showBootScreen,
      hideBootScreen,
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

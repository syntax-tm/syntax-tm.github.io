"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import usePath from "@hooks/usePath";
import { useTheme } from "./ThemeContext";

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

  if (modal) {
    bootShownRef.current = true;
  }

  const showBootScreen = useCallback(() => {
    setIsBootVisible(true);
    setIsBootTransitioningOut(false);
  }, []);

  const hideBootScreen = useCallback(() => {
    setIsBootTransitioningOut(false);
    setIsBootVisible(false);
  }, []);

  // disables boot screen on any modal (to allow directly linking to them without the boot animation)
  useEffect(() => {
    if (modal)
      bootShownRef.current = true;
  }, [modal]);

  useEffect(() => {
    if (!isBootVisible) return;
    if (!boot) return;

    const bootDuration = boot.bootDuration;
    //const fadeInDuration = boot.bootFadeInDuration ?? 0;
    const fadeOutDuration = boot.bootFadeOutDuration ?? 0;

    const fadeOutTimer = window.setTimeout(() => {
      setIsBootTransitioningOut(true);
    }, boot.bootDuration - fadeOutDuration);

    const hideTimer = window.setTimeout(() => {
      setIsBootVisible(false);
      setIsBootTransitioningOut(false);
      bootShownRef.current = true;
    }, bootDuration);

    return () => {
      window.clearTimeout(fadeOutTimer);
      window.clearTimeout(hideTimer);
    };
  }, [isBootVisible]);

  const value = useMemo(
    () => ({
      isBootVisible,
      isBootTransitioningOut,
      showBootScreen,
      hideBootScreen,
    }),
    [isBootVisible, isBootTransitioningOut, showBootScreen, hideBootScreen],
  );

  const hasBoot = boot ?? false;
  const previouslyShown = bootShownRef.current === true;
  const shouldShowOverlay = hasBoot && !previouslyShown && (isBootVisible || isBootTransitioningOut);

  return <BootContext.Provider value={value}>
    {children}
    {shouldShowOverlay && (
      boot?.element
    )}
  </BootContext.Provider>;
}

export function useBoot() {
  const context = useContext(BootContext);

  if (!context) {
    throw new Error("useBoot must be used within a BootProvider");
  }

  return context;
}

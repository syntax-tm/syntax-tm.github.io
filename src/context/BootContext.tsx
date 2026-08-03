"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface BootContextType {
  isBootVisible: boolean;
  isBootTransitioningOut: boolean;
  showBootScreen: () => void;
  hideBootScreen: () => void;
}

const BootContext = createContext<BootContextType | undefined>(undefined);

// these need to match the values in styles\animations.css
const BOOT_DURATION_MS = 4400;
const BOOT_FADE_OUT_MS = 600;

export function BootProvider({ children }: { children: React.ReactNode }) {
  const [isBootVisible, setIsBootVisible] = useState(true);
  const [isBootTransitioningOut, setIsBootTransitioningOut] = useState(false);

  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    setPathname(window.location.pathname);
    const handleLocationChange = () => setPathname(window.location.pathname);

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  const modal = pathname !== '/' && pathname !== '/boot';

  const showBootScreen = useCallback(() => {
    setIsBootVisible(true);
    setIsBootTransitioningOut(false);
  }, []);

  const hideBootScreen = useCallback(() => {
    setIsBootTransitioningOut(false);
    setIsBootVisible(false);
  }, []);

  useEffect(() => {
    if (!isBootVisible) {
      return;
    }

    const fadeOutTimer = window.setTimeout(() => {
      setIsBootTransitioningOut(true);
    }, BOOT_DURATION_MS - BOOT_FADE_OUT_MS);

    const hideTimer = window.setTimeout(() => {
      setIsBootVisible(false);
      setIsBootTransitioningOut(false);
    }, BOOT_DURATION_MS);

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

  const shouldShowOverlay = (isBootVisible || isBootTransitioningOut) && !modal;

  return <BootContext.Provider value={value}>
    {children}
    {shouldShowOverlay && (
      <div className="boot-screen right-0">
        <div className="boot-content slide-in-out flex flex-col">
          <div className="fixed">

          </div>
          <div className="relative grid">
            <div className="text-3xl select-none">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-4" />
              Loading
            </div>
          </div>
        </div>
      </div>
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

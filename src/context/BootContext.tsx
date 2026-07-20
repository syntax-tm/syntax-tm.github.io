"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@components/boot/boot.css';

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

  const shouldShowOverlay = isBootVisible || isBootTransitioningOut;

  return <BootContext.Provider value={value}>
    {children}
    {shouldShowOverlay && (
      <div className="boot-screen right-0">
        <div className="boot-content slide-in-out flex flex-col">
          <div className="fixed">

          </div>
          {/* <div className="boot-title text-3xl select-none"> */}
          <div className="relative grid">
            <div className="text-3xl select-none">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-4" />
              Loading
            </div>
          </div>
          {/* <div className="dropping-texts text-right">
              <div className="inline-block">
                <FontAwesomeIcon icon={faGithub} /><span>GitHub</span>
              </div>
              <div className="inline-block">
                <FontAwesomeIcon icon={faXbox} /><span>Xbox</span>
              </div>
              <div className="inline-block">
                <FontAwesomeIcon icon={faSpotify} /><span>Spotify</span>
              </div>
              <div className="inline-block">
                <FontAwesomeIcon icon={faFacebook} /><span>Facebook</span>
              </div>
              <div className="inline-block">
                <FontAwesomeIcon icon={faSteam} /><span>Steam</span>
              </div>
              <div className="inline-block">
                <FontAwesomeIcon icon={faDiscord} /><span>Discord</span>
              </div>
              <div className="inline-block">
                <FontAwesomeIcon icon={faBattleNet} /><span>Battle.Net</span>
              </div>
              <div className="inline-block">
                <FontAwesomeIcon icon={faInstagram} /><span>Instagram</span>
              </div>
            </div>
          </div>*/}
        </div>
        {/* <div className="boot-subtitle select-none text-lg opacity-85"><FontAwesomeIcon icon={faGithub}></FontAwesomeIcon> syntax-tm</div> */}
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

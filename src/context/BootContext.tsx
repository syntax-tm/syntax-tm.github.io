"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NextParticles } from "@tsparticles/nextjs";
import { type ISourceOptions } from "@tsparticles/engine";
import '@components/boot/boot.css';

interface BootContextType {
  isBootVisible: boolean;
  isBootTransitioningOut: boolean;
  showBootScreen: () => void;
  hideBootScreen: () => void;
}

const BootContext = createContext<BootContextType | undefined>(undefined);
const BOOT_DURATION_MS = 5000;
const BOOT_FADE_OUT_MS = 750;

export function BootProvider({ children }: { children: React.ReactNode }) {
  const [isBootVisible, setIsBootVisible] = useState(true);
  const [isBootTransitioningOut, setIsBootTransitioningOut] = useState(false);

  const particlesOptions: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "#fff",
        },
      },
      fpsLimit: 120,
      zIndex: -40,
      fullScreen: {
        enable: true,
        zIndex: -40,
      },
      particles: {
        number: {
          value: 20,
          density: { enable: false, value_area: 1104.8066982851817 },
        },
        color: { value: "#ffffff" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: {
          value: 11.83721462448409,
          random: true,
          anim: {
            enable: true,
            speed: 11.988011988011989,
            size_min: 0.1,
            sync: true,
          },
        },
        zIndex: {
          value: 100,
          random: false,
          anim: { enable: false, speed: 1, zIndex_min: 0, sync: false },
        },
        line_linked: {
          enable: false,
        },
        move: {
          enable: true,
          speed: 3.206824121731046,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: { enable: false, rotateX: 600, rotateY: 1200 },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: false, mode: "repulse" },
          onclick: { enable: false, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    }),
    [],
  );

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
      <div className="boot-screen">
        <div className="boot-particles" aria-hidden="true">
          <NextParticles id="boot-particles" options={particlesOptions} />
        </div>
        <div className="boot-content">
          <span className="boot-title">@syntax-tm</span>
          <span className="boot-subtitle">Trey</span>
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

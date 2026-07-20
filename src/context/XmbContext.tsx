"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
// import { useAudio } from '@context/AudioContext';
// import { useSnackbar } from "@context/SnackbarContext";
// import { useGamepads } from 'awesome-react-gamepads';
// import { useKeySequence } from "@hooks/useKeySequence";
import { XmbMenu } from "@/models/menu";
import build from "@/services/menuBuilder";

// TODO: this context will need to be all of the state from the xmbmenu class
interface XmbContextType {
  menu: XmbMenu | null;
}

const XmbContext = createContext<XmbContextType | undefined>(undefined);

export function XmbProvider({ children }: { children: React.ReactNode }) {
  const xmbMenuRef = useRef<XmbMenu | null>(null);

  useEffect(() => {
    // only build the menu once
    if (!xmbMenuRef.current) {
      const menu = build();
      xmbMenuRef.current = menu;
    }

    return () => {};
  }, []);

  const value = {
    menu: xmbMenuRef.current,
  };

  return (
    <XmbContext.Provider value={value}>
      {children}
    </XmbContext.Provider>
  );
}

export function useXmb() {
  const context = useContext(XmbContext);
  if (!context) {
    throw new Error("useSecret must be used within a SecretProvider");
  }
  return context;
}

"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAudio, useTheme } from "@context";
import { useSearchParams } from "next/navigation";


interface WiiNavigationContextType {
  totalPages: number;
  currentPage: number;
  allowFirst: boolean;
  allowPrev: boolean;
  allowNext: boolean;
  allowLast: boolean;
  setPageTotal: (count: number) => void;
  setPage: (index: number) => void;
  moveFirst: () => void;
  moveLast: () => void;
  movePrev: () => void;
  moveNext: () => void;
}

const WiiNavigationContext = createContext<WiiNavigationContextType | undefined>(undefined);

export function WiiNavigationProvider({ children }: { children: React.ReactNode }) {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [allowFirst, setAllowFirst] = useState(false);
  const [allowPrev, setAllowPrev] = useState(false);
  const [allowNext, setAllowNext] = useState(false);
  const [allowLast, setAllowLast] = useState(false);

  const setPageTotal = (count: number) => {
    setTotalPages(count);
  };

  const setPage = (index: number) => {
    setCurrentPage(index);
  };

  const moveFirst = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const moveLast = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const movePrev = useCallback(() => {
    if (currentPage <= 0) return;
    setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const moveNext = useCallback(() => {
    if (currentPage >= totalPages - 1) return;
    setCurrentPage(currentPage + 1);
  }, [totalPages, currentPage]);

  useEffect(() => {
    setAllowFirst(currentPage > 0);
    setAllowPrev(currentPage > 0);
    setAllowLast(currentPage < totalPages - 1);
    setAllowNext(currentPage < totalPages - 1);
  }, [totalPages, currentPage]);

  const value = {
    totalPages,
    currentPage,
    allowFirst,
    allowPrev,
    allowNext,
    allowLast,
    setPageTotal,
    setPage,
    moveFirst,
    moveLast,
    movePrev,
    moveNext,
  };

  return <WiiNavigationContext.Provider value={value}>
    {children}
  </WiiNavigationContext.Provider>;
}

export function useNavigation() {
  const context = useContext(WiiNavigationContext);

  if (!context) {
    throw new Error("useNavigation must be used within a WiiNavigationContext");
  }

  return context;
}

'use client';

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export interface WiiMenuNavProps {
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

export function WiiMenuNav(): WiiMenuNavProps {
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
    if (currentPage >= 1) return;
    setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const moveNext = useCallback(() => {
    if (currentPage >= totalPages) return;
    setCurrentPage(currentPage + 1);
  }, [totalPages, currentPage]);

  useEffect(() => {
    setAllowFirst(currentPage > 1);
    setAllowPrev(currentPage > 1);
    setAllowLast(currentPage < totalPages);
    setAllowNext(currentPage < totalPages);
  }, [totalPages, currentPage]);

  return {
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
}

export { WiiMenuNav as default };

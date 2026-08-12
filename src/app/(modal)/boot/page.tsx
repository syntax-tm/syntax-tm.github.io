"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBoot } from '@context/BootContext';
import { useTheme } from "@context";

export default function BootPage() {
  const router = useRouter();
  const { currentTheme, boot } = useTheme();
  const { isBootVisible, showBootScreen, hideBootScreen } = useBoot();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hideBootScreen();
      router.replace("/");
    }, boot?.bootDuration ?? 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [router, boot, currentTheme]);

  useEffect(() => {
    if (!isBootVisible) {
      router.replace("/");
    }
  }, [isBootVisible]);

  return (
    <div className="root-container relative min-h-screen overflow-hidden pointer-events-auto opacity-100">
      { boot?.element }
    </div>
  );
}

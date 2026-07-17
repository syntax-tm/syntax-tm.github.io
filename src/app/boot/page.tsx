"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Background from '@components/background/background';
import { useBoot } from '@context/BootContext';

export default function BootPage() {
  const router = useRouter();
  const { showBootScreen } = useBoot();

  useEffect(() => {
    showBootScreen();

    const timer = window.setTimeout(() => {
      router.replace("/");
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [router, showBootScreen]);

  return (
    <div className="root-container relative min-h-screen overflow-hidden pointer-events-auto opacity-100">
      <Background />
    </div>
  );
}

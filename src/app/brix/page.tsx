'use client';

import { useEffect } from "react";
import { useBoot, useSecret, useTheme } from "@context";
import { BootView } from "@components/boot";
import { BackgroundView } from "@components/background";
import { Menu } from "@components/xmb-menu";
import { useRouter } from "next/navigation";

export function BrixPage() {

  const { brixStore } = useSecret();
  const router = useRouter();

  useEffect(() => {

    if (!brixStore.isUnlocked) {
      brixStore.unlock();
    }

    brixStore.enable();
    router.replace("/");

  }, []);

  const { isBootVisible } = useBoot();
  const { currentTheme, font } = useTheme();

  const themeClassName = currentTheme ? currentTheme.className : 'default-theme';
  const fontClassName = font ? font.className : 'default-font';
  const clock = currentTheme?.clock;

  return (
    <div className={`root-container ${themeClassName} ${fontClassName}`}>
      {
        isBootVisible
          ?
          <>
            <BootView />
          </>
          :
          <>
            <BackgroundView />
            {clock}
            <Menu />
          </>
      }
    </div>
  );
}

export { BrixPage as default };

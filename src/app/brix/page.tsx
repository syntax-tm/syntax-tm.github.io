'use client';

import { useEffect } from "react";
import { useBoot, useSecret, useTheme } from "@context";
import { BrixBoot } from "@components/boot";
import { BrixBackground } from "@components/background";
import { Menu } from "@components/xmb-menu";
import { useRouter } from "next/navigation";

export function BrixPage() {

  const { brixStore } = useSecret();
  const router = useRouter();

  useEffect(() => {

    if (!brixStore) return;
    if (!brixStore.isUnlocked) {
      brixStore.unlock();
    }

    brixStore.enable();
    router.push("/");

  }, [brixStore]);

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
          <BrixBoot />
          :
          <>
            <BrixBackground />
            {clock}
            <Menu />
          </>
      }
    </div>
  );
}

export { BrixPage as default };

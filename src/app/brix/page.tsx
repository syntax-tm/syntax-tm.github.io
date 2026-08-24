'use client';

import { useEffect } from "react";
import { useBoot, useTheme } from "@context";
import { BootView, BrixBoot } from "@components/boot";
import { BackgroundView, BrixBackground } from "@components/background";
import { Menu } from "@components/xmb-menu";
// import { useRouter } from "next/navigation";
import { useSettingStore } from "@stores";

export function BrixPage() {

  const { isUnlocked, unlock, enable } = useSettingStore("BRIX", (state) => state);
  //const router = useRouter();

  const { isBootVisible } = useBoot();
  const { currentTheme, font } = useTheme();

  useEffect(() => {

    if (!isUnlocked) {
      unlock();
    }

    enable();

  }, [isUnlocked, unlock, enable]);

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

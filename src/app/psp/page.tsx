'use client';

import React, { useEffect } from "react";
import { useBoot, useTheme } from "@context";
import { PspBoot } from "@components/boot";
import { PspBackground } from "@components/background";
import { Menu } from "@components/xmb-menu";
import { useSettingStore } from "@stores";
import { PspClock } from "@components/clock";

export function BrixPage() {

  const unlock = useSettingStore('PSP', (state) => state.unlock);
  //const router = useRouter();

  const { isBootVisible } = useBoot();
  const { currentTheme, font } = useTheme();

  useEffect(() => {
    unlock();
  }, [unlock]);

  const themeClassName = currentTheme ? currentTheme.className : 'default-theme';
  const fontClassName = font ? font.className : 'default-font';
  return (
    <div className={`root-container ${themeClassName} ${fontClassName}`}>
      {
        isBootVisible
          ?
          <PspBoot />
          :
          <>
            <PspBackground />
            <PspClock />
            <Menu />
          </>
      }
    </div>
  );
}

export { BrixPage as default };

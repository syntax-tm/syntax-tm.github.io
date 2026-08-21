'use client';

import { useEffect } from "react";
import { useBoot, useSecret, useTheme } from "@context";
import { BootView, Ps2Boot } from "@components/boot";
import { BackgroundView, PS2Background } from "@components/background";
import { Menu } from "@components/xmb-menu";

export function Ps2Page() {

  const { ps2Store } = useSecret();

  useEffect(() => {

    if (ps2Store.isUnlocked) {
      ps2Store.unlock();
    }

    ps2Store.enable();

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
            <Ps2Boot />
          </>
          :
          <>
            <PS2Background />
            {clock}
            <Menu />
          </>
      }
    </div>
  );
}

export { Ps2Page as default };

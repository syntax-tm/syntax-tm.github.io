"use client";

import React, { useCallback, useEffect, useMemo, useContext } from "react";
import { useRef, useState, CSSProperties } from "react";
import { useRouter, ReadonlyURLSearchParams } from "next/navigation";
import { XmbItem, XmbMenu } from "@models/menu";
import { MenuCategory } from "./xmb-menu-category";
import useWheel, { WheelInput } from "@hooks//useWheel";
import useKeyboard, { KeyPressAction } from "@hooks/useKeyboard";
import useSwipe, { SwipeInput } from "@hooks/useSwipe";
import useMobileDetect from "@hooks/useMobileDetect";
import useQuery from "@hooks/useQuery";
import { useWindowSize } from "@uidotdev/usehooks";
import { useGamepads } from 'awesome-react-gamepads';
import { useSnackbar } from "@context/SnackbarContext";
import { useAudio } from '@context/AudioContext';
import { useXmb } from "@context/XmbContext";
import "./xmb.scss";

export default function Menu() {

  const router = useRouter();

  const currentDevice = useMobileDetect();
  const windowSize = useWindowSize();
  const { showSnackbar } = useSnackbar();
  //const xmbMenuRef = useRef<XmbMenu | null>(null);

  const [modal, setModal] = useState<string | null>(null);

  const { play } = useAudio();
  const { openItem, menu, x } = useXmb();

  // const getXmbMenu = useCallback(() => {
  //   if (xmbMenuRef.current === null) {
  //     xmbMenuRef.current = build();
  //   }
  //   return xmbMenuRef.current;
  // }, []);

  // TODO: this should be CSS and calculated using breakpoints
  const mainStyle: CSSProperties = useMemo(() => {
    const isMobile = currentDevice.isMobile();

    const height = windowSize?.height ?? 0;
    const width = windowSize?.width ?? 0;

    const scaleX = isMobile || height > width
      ? 140
      : 270;
    const baseMarginLeft = isMobile ? 20 : 100;

    const ml = baseMarginLeft - (scaleX * x);

    return {
      marginRight: '0%',
      marginLeft: `${ml}px`,
      width: '200%',
      display: 'flex',
    };
  }, [currentDevice, x]);

  return (
    <div className='xmb-menu'>
      <main id="menu" className="">
        <section className="xmb-main w-max" style={mainStyle}>
          {
            menu
            && menu.items.map((item, i) => (
              <MenuCategory
                index={i}
                key={item.title}
                category={item}
                openItem={openItem}
              />
            ))
          }
        </section>
      </main>
    </div>
  );
};

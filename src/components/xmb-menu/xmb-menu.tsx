"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useRef, useState, CSSProperties } from "react";
import { useRouter, ReadonlyURLSearchParams } from "next/navigation";
import { XmbMenu } from "@models/menu";
import { MenuCategory } from "./xmb-menu-category";
import useWheel, { WheelInput } from "@/hooks/useWheel";
import useKeyboard, { KeyPressAction } from "@/hooks/useKeyboard";
import useSwipe, { SwipeInput } from "@/hooks/useSwipe";
import useMobileDetect from "@/hooks/useMobileDetect";
import useQuery from "@/hooks/useQuery";
import build from "@services/menuBuilder";
import { useWindowSize } from "@uidotdev/usehooks";
import { useGamepads } from 'awesome-react-gamepads';
import { useSnackbar } from "@context/SnackbarContext";
import { useAudio } from '@context/AudioContext';
import { useXmb } from "@/context/XmbContext";
import "./xmb.css";

//const config: XmbMenu = build();

const XMB_AUDIO_SRC = "/audio/nav.mp3";

export default function Menu() {


  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const router = useRouter();

  const currentDevice = useMobileDetect();
  const windowSize = useWindowSize();
  const { showSnackbar } = useSnackbar();
  //const xmbMenuRef = useRef<XmbMenu | null>(null);

  const [modal, setModal] = useState<string | null>(null);

  const { play } = useAudio();
  const { menu } = useXmb();

  // const getXmbMenu = useCallback(() => {
  //   if (xmbMenuRef.current === null) {
  //     xmbMenuRef.current = build();
  //   }
  //   return xmbMenuRef.current;
  // }, []);

  const openInNewTab = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const onEsc = useCallback(() => {
    play(XMB_AUDIO_SRC);

    if (x == 0 && y == 0) {
      return;
    }

    setX(0);
    setY(0);
  }, [modal, menu]);

  const onBack = useCallback(() => {
    if (!modal) return;

    play(XMB_AUDIO_SRC);

    router.push('/');
  }, [modal, menu]);

  const onHelp = useCallback(() => {
    play(XMB_AUDIO_SRC);

    router.push('/?modal=help');
  }, [modal, menu]);

  const onEnter = useCallback(() => {
    play(XMB_AUDIO_SRC);

    const config = getXmbMenu();
    if (config === null) return;

    const selectedCategory = config.getCurrentCategory();
    const selectedItem = selectedCategory.getCurrentItem();

    if (selectedItem.modal) {
      router.push(`/?modal=${selectedItem.modal}`);
      return;
    }

    if (selectedItem.link) {
      openInNewTab(selectedItem.link);
      return;
    }

    if (selectedItem.onClick !== null) {
      selectedItem.onClick!();
      return;
    }

    console.warn(`No action for ${selectedItem.title} in ${selectedCategory.title}`);
  }, [modal, menu]);

  const onUp = useCallback(() => {
    if (modal) return;

    const config = getXmbMenu();
    if (config === null) return;

    const position = config.moveUp();
    if (position === null) return;
    play(XMB_AUDIO_SRC);
    setY(position.y);
  }, [modal, menu]);

  const onTop = useCallback(() => {
    if (modal) return;

    const config = getXmbMenu();
    if (config === null) return;

    const position = config.moveTop();
    if (position === null) return;
    play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }, [modal, menu]);

  const onDown = useCallback(() => {
    if (modal) return;

    const config = getXmbMenu();
    if (config === null) return;

    const position = config.moveDown();
    if (position === null) return;
    play(XMB_AUDIO_SRC);
    setY(position.y);
  }, [modal, menu]);

  const onBottom = useCallback(() => {
    if (modal) return;

    const config = getXmbMenu();
    if (config === null) return;

    const position = config.moveBottom();
    if (position === null) return;
    play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }, [modal, menu]);

  const onLeft = useCallback(() => {
    if (modal) return;

    const config = getXmbMenu();
    if (config === null) return;

    const position = config.moveLeft();
    if (position === null) return;
    play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }, [modal, menu]);

  const onFirst = useCallback(() => {
    if (modal) return;

    const config = getXmbMenu();
    if (config === null) return;

    const position = config.moveFirst();
    if (position === null) return;
    play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }, [modal, menu]);

  const onRight = useCallback(() => {
    if (modal) return;

    const config = getXmbMenu();
    if (config === null) return;

    const position = config.moveRight();
    if (position === null) return;
    play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }, [modal, menu]);

  const onLast = useCallback(() => {
    if (modal) return;

    const config = getXmbMenu();
    if (config === null) return;

    const position = config.moveLast();
    if (position === null) return;
    play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }, [modal, menu]);

  const onPathChanged = useCallback((path: string, searchParams: ReadonlyURLSearchParams, modal: string | null) => {
    setModal(modal);
  }, [setModal]);

  useQuery({ onPathChanged: onPathChanged });

  const actions = useMemo(() => {
    const items = new Map<string, KeyPressAction>();

    items.set('w', { repeat: true, onKeyPress: onUp });
    items.set('arrowup', { repeat: true, onKeyPress: onUp });
    items.set('a', { repeat: true, onKeyPress: onLeft });
    items.set('arrowleft', { repeat: true, onKeyPress: onLeft });
    items.set('s', { repeat: true, onKeyPress: onDown });
    items.set('arrowdown', { repeat: true, onKeyPress: onDown });
    items.set('d', { repeat: true, onKeyPress: onRight });
    items.set('arrowright', { repeat: true, onKeyPress: onRight });
    items.set(' ', { repeat: false, onKeyPress: onEnter });
    items.set('enter', { repeat: false, onKeyPress: onEnter });
    items.set('escape', { repeat: false, onKeyPress: onEsc });
    items.set('h', { repeat: false, onKeyPress: onHelp });
    items.set('f1', { repeat: false, onKeyPress: onHelp });
    items.set('q', { repeat: false, onKeyPress: onFirst });
    items.set('e', { repeat: false, onKeyPress: onLast });
    items.set('z', { repeat: false, onKeyPress: onTop });
    items.set('x', { repeat: false, onKeyPress: onBottom });

    return items;
  }, [onUp, onDown, onLeft, onRight, onEnter, onEsc, onHelp, onFirst, onLast, onTop, onBottom]);

  useKeyboard({ actions: actions, enabledOnModal: false });

  useGamepads({
    onConnect: (gamepad) => {
      console.log(`gamepad connected: ${gamepad.id} (${gamepad.index})`);
      console.log('buttons:');
      console.log(JSON.stringify(gamepad.buttons, null, 2));

      showSnackbar(`Gamepad ${gamepad.id} (${gamepad.index}) connected.`, 'success');
    },
    onDisconnect: (gamepad) => {
      console.log(`gamepad disconnected: ${gamepad.id} (${gamepad.index})`);

      showSnackbar(`Gamepad ${gamepad.id} (${gamepad.index}) disconnected.`, 'error');
    },
    controllerProfile: 'xbox',
    onA: onEnter,
    onB: onBack,
    onDPadUp: onUp,
    onDPadDown: onDown,
    onDPadLeft: onLeft,
    onDPadRight: onRight,
    onLeftStickUp: onUp,
    onLeftStickDown: onDown,
    onLeftStickLeft: onLeft,
    onLeftStickRight: onRight,
    onRightStickUp: onUp,
    onRightStickDown: onDown,
    onRightStickLeft: onLeft,
    onRightStickRight: onRight,
    onStart: onEnter,
    onSelect: onHelp,
    onLT: onTop,
    onRT: onBottom,
    onLB: onFirst,
    onRB: onLast,
  });

  const wheelInput: WheelInput = useMemo(() => {
    return {
      onWheelDown: onDown,
      onWheelUp: onUp,
      onWheelLeft: onLeft,
      onWheelRight: onRight,
      enabledOnModal: false,
    };
  }, [onUp, onDown, onLeft, onRight]);

  useWheel(wheelInput);

  const swipeInput: SwipeInput = useMemo(() => {
    return {
      onSwipedUp: onDown,
      onSwipedDown: onUp,
      onSwipedRight: onLeft,
      onSwipedLeft: onRight,
      enabledOnModal: false,
    };
  }, [onUp, onDown, onLeft, onRight]);
  useSwipe(swipeInput);

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
  }, [currentDevice]);

  useEffect(() => {
    if (xmbMenuRef.current === null) {
      xmbMenuRef.current = build();
    }

    return () => {};
  });

  return (
    <div className='xmb-menu'>
      <main id="menu" className="">
        <section className="xmb-main boot-fade-in" style={mainStyle}>
          {
            xmbMenuRef.current
            && xmbMenuRef.current.items.map((item, i) => (
              <MenuCategory
                index={i}
                key={item.title}
                category={item}
                x={x}
                y={y}
                menuRef={xmbMenuRef}
              />
            ))
          }
        </section>
      </main>
    </div>
  );
};

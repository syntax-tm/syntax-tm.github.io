"use client";

import React from "react";
import { useRef, useState, CSSProperties } from "react";
import { useRouter, ReadonlyURLSearchParams } from "next/navigation";
import { XmbMenu } from "@models/menu";
import { MenuCategory } from "./xmb-menu-category";
import Title from "@components/title/title";
import useWheel, { WheelInput } from "@/hooks/useWheel";
import useKeyboard, { KeyPressAction } from "@/hooks/useKeyboard";
import useSwipe, { SwipeInput } from "@/hooks/useSwipe";
import useMobileDetect from "@/hooks/useMobileDetect";
import useQuery from "@/hooks/useQuery";
import build from "@services/menuBuilder";
import "./xmb.css";
import { useWindowSize } from "@uidotdev/usehooks";
import { useGamepads } from 'awesome-react-gamepads';
import { useSnackbar } from "@context/SnackbarContext";
import { useAudio } from '@context/AudioContext';

const config: XmbMenu = build();

const XMB_AUDIO_SRC = "/audio/nav.mp3";

export default function Menu() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const router = useRouter();

  const currentDevice = useMobileDetect();
  const windowSize = useWindowSize();
  const { showSnackbar } = useSnackbar();

  const [modal, setModal] = useState<string | null>(null);

  const { play } = useAudio();

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  async function onEsc() {
    await play(XMB_AUDIO_SRC);

    if (x == 0 && y == 0) {
      return;
    }

    setX(0);
    setY(0);
  }

  async function onBack() {
    if (!modal) return;

    await play(XMB_AUDIO_SRC);

    router.push('/');
  }

  async function onHelp() {
    await play(XMB_AUDIO_SRC);

    router.push('/?modal=help');
  }

  async function onEnter() {
    await play(XMB_AUDIO_SRC);

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
  }

  async function onUp() {
    if (modal) return;
    const position = config.moveUp();
    if (position === null) return;
    await play(XMB_AUDIO_SRC);
    setY(position.y);
  }

  async function onTop() {
    if (modal) return;
    const position = config.moveTop();
    if (position === null) return;
    await play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }

  async function onDown() {
    if (modal) return;
    const position = config.moveDown();
    if (position === null) return;
    await play(XMB_AUDIO_SRC);
    setY(position.y);
  }

  async function onBottom() {
    if (modal) return;
    const position = config.moveBottom();
    if (position === null) return;
    await play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }

  async function onLeft() {
    if (modal) return;
    const position = config.moveLeft();
    if (position === null) return;
    await play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }

  async function onFirst() {
    if (modal) return;
    const position = config.moveFirst();
    if (position === null) return;
    await play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }

  async function onRight() {
    if (modal) return;
    const position = config.moveRight();
    if (position === null) return;
    await play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }

  async function onLast() {
    if (modal) return;
    const position = config.moveLast();
    if (position === null) return;
    await play(XMB_AUDIO_SRC);
    setX(position.x);
    setY(position.y);
  }

  function onPathChanged(path: string, searchParams: ReadonlyURLSearchParams, modal: string | null) {
    setModal(modal);
  }

  useQuery({ onPathChanged: onPathChanged });

  const actions = new Map<string, KeyPressAction>();

  actions.set('w', { repeat: true, onKeyPress: onUp });
  actions.set('arrowup', { repeat: true, onKeyPress: onUp });
  actions.set('a', { repeat: true, onKeyPress: onLeft });
  actions.set('arrowleft', { repeat: true, onKeyPress: onLeft });
  actions.set('s', { repeat: true, onKeyPress: onDown });
  actions.set('arrowdown', { repeat: true, onKeyPress: onDown });
  actions.set('d', { repeat: true, onKeyPress: onRight });
  actions.set('arrowright', { repeat: true, onKeyPress: onRight });
  actions.set(' ', { repeat: false, onKeyPress: onEnter });
  actions.set('enter', { repeat: false, onKeyPress: onEnter });
  actions.set('escape', { repeat: false, onKeyPress: onEsc });
  actions.set('h', { repeat: false, onKeyPress: onHelp });
  actions.set('f1', { repeat: false, onKeyPress: onHelp });
  actions.set('q', { repeat: false, onKeyPress: onFirst });
  actions.set('e', { repeat: false, onKeyPress: onLast });
  actions.set('z', { repeat: false, onKeyPress: onTop });
  actions.set('x', { repeat: false, onKeyPress: onBottom });

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

  const wheelInput: WheelInput = {
    onWheelUp: onUp,
    onWheelDown: onDown,
    onWheelLeft: onLeft,
    onWheelRight: onRight,
    enabledOnModal: false,
  };

  useWheel(wheelInput);

  const swipeInput: SwipeInput = {
    onSwipedUp: onDown,
    onSwipedDown: onUp,
    onSwipedLeft: onRight,
    onSwipedRight: onLeft,
    enabledOnModal: false,
  };
  useSwipe(swipeInput);

  const isMobile = currentDevice.isMobile();

  const height = windowSize?.height ?? 0;
  const width = windowSize?.width ?? 0;

  const scaleX = isMobile || height > width
    ? 140
    : 270;
  const baseMarginLeft = isMobile ? 20 : 100;

  const ml = baseMarginLeft - (scaleX * x);

  const mainStyle:CSSProperties = {
    marginRight: '0%',
    marginLeft: `${ml}px`,
    width: '200%',
    display: 'flex',
  };

  return (
    <div className='xmb-menu'>
      <Title />
      <main id="menu" className="">
        <section className="xmb-main" style={mainStyle}>
          {
            config !== undefined &&
            config.items.length > 0 &&
            config.items.map((item, i) => (
              <MenuCategory
                index={i}
                key={item.title}
                category={item}
                x={x}
                y={y}
              />
            ))
          }
        </section>
      </main>
    </div>
  );
};

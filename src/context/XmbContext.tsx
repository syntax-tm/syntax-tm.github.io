"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { useRouter, ReadonlyURLSearchParams, useSelectedLayoutSegments } from "next/navigation";
// import { useAudio } from '@context/AudioContext';
// import { useSnackbar } from "@context/SnackbarContext";
// import { useGamepads } from 'awesome-react-gamepads';
// import { useKeySequence } from "@hooks/useKeySequence";
import useWheel, { WheelInput } from "@hooks//useWheel";
import useKeyboard, { KeyPressAction } from "@hooks/useKeyboard";
import useQuery from "@hooks/useQuery";
import useSwipe, { SwipeInput } from "@hooks/useSwipe";
import { useSnackbar } from "@context/SnackbarContext";
import { useAudio } from '@context/AudioContext';
import { useGamepads } from 'awesome-react-gamepads';
import { Position, XmbCategory, XmbItem, XmbMenu } from "@models/menu";
import build from "@services/menuBuilder";

// TODO: this context will need to be all of the state from the xmbmenu class
export interface XmbContextType {
  menu: XmbMenu | null;
  currentCategory: XmbCategory | null;
  currentItem: XmbItem | null;
  currentItems: XmbItem[] | null;
  x: number;
  y: number;
  openInNewTab: (url: string) => void;
  openItem: (item: XmbItem) => void;
  toXmbKey: (x: number, y: number) => string;
}

export interface XmbState {
  x: number;
  y: number;
  position: Position;
  currentItem: XmbItem | null;
  currentItems: XmbItem[] | null;
  currentCategory: XmbCategory | null;
}

export const toXmbKey = (x: number, y: number) => {
  return [x, y].join(',');
};

export const openInNewTab = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const defPos: Position = { x: 0, y: 0 } as const;

const XMB_AUDIO_SRC = "/audio/nav.mp3";

const cache: Record<number, number> = {};

const XmbContext = createContext<XmbContextType | undefined>(undefined);

export function XmbProvider({ children }: { children: React.ReactNode }) {

  const router = useRouter();
  //const [xmbState, setXmbState] = useState<XmbState | null>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  //const [position, setPositon] = useState<Position>({} as Position);
  const positionRef = useRef<Position>({} as Position);
  const xmbItemRef = useRef<Map<string, XmbItem> | null>(null);
  const [categories, setCategories] = useState<XmbCategory[] | null>(null);
  const [currentCategory, setCurrentCategory] = useState<XmbCategory | null>(null);
  const [currentItem, setCurrentItem] = useState<XmbItem | null>(null);
  const [currentItems, setCurrentItems] = useState<XmbItem[] | null>(null);
  //const [modal, setModal] = useState<string | null>(null);
  const xmbMenuRef = useRef<XmbMenu | null>(null);
  const { play } = useAudio();
  const { showSnackbar } = useSnackbar();

  const segment = useSelectedLayoutSegments('modal');
  const modal = segment.filter(s => !s.startsWith('(')).length !== 0;

  if (!xmbItemRef.current) {
    xmbItemRef.current = new Map<string, XmbItem>();
  }

  // only build the menu once
  if (!xmbMenuRef.current) {
    const menu = build();
    xmbMenuRef.current = menu;
    setCategories(menu.items);
    const cat = menu.items[0];
    setCurrentCategory(cat);
    setCurrentItems(cat.items);
    if (cat.items[0])
      setCurrentItem(cat.items[0]);

    // save the item ref to find items by key directly
    for (let i = 0; i < menu.items.length; i++) {
      const cat = menu.items[i];
      for (let j = 0; j < cat.items.length; j++) {
        const item = cat.items[j];
        xmbItemRef.current.set(toXmbKey(i, j), item);
      }
    }
  }

  // udpates the selected item (y)
  const updateY = useCallback((newY: number) => {
    // update cache
    cache[positionRef.current.x] = newY;
    positionRef.current = { ...positionRef.current, y: newY };
    if (!currentCategory) return;
    const item = currentCategory.items[newY];
    setCurrentItem(item);
    setY(newY);
  }, [currentCategory]);

  // udpates both the category (x) and restores the previous selected item (y)
  const updateX = useCallback((newX: number, loadCache: boolean = true) => {
    const prevY = loadCache ? (cache[newX] ?? 0) : 0;
    setX(newX);
    positionRef.current = { x: newX, y: prevY };
    if (!categories) return;
    const cat = categories[newX];
    setCurrentCategory(cat);
    setCurrentItems(cat.items);
    updateY(prevY);
  }, [categories, updateY]);

  const openItem = useCallback((item: XmbItem) => {
    if (item.modal) {
      router.push(`/${item.modal}`);
      return;
    }

    if (item.link) {
      openInNewTab(item.link);
      return;
    }

    if (item.onClick) {
      item.onClick();
      return;
    }

    console.warn(`No action for ${item.title} in ${item.category}`);
  }, []);

  const onEnter = useCallback(() => {
    if (!xmbItemRef.current) return;

    play(XMB_AUDIO_SRC);

    const key = toXmbKey(x, y);
    const item = xmbItemRef.current.get(key);

    if (!item) return;

    openItem(item);
  }, [x, y]);

  const moveDefault = useCallback(() => {
    updateX(0, false);
    updateY(0);

    return defPos;
  }, []);

  const onEsc = useCallback(() => {
    if (!moveDefault()) return;

    play(XMB_AUDIO_SRC);
  }, [play]);

  const onBack = useCallback(() => {
    if (!modal) return;

    play(XMB_AUDIO_SRC);

    router.push('/');
  }, [modal, play]);

  const onHelp = useCallback(() => {
    play(XMB_AUDIO_SRC);

    router.push('/?modal=help');
  }, []);

  const moveUp = useCallback(() => {
    const nextY = y - 1;

    play(XMB_AUDIO_SRC);

    if (nextY < 0) return null;

    updateY(nextY);

    return positionRef.current;
  }, [y, updateY]);

  const moveTop = useCallback(() => {
    const nextY = 0;

    play(XMB_AUDIO_SRC);

    if (y === nextY) return null;

    updateY(nextY);

    return positionRef.current;
  }, [y, updateY]);

  const moveDown = useCallback(() => {
    if (!currentCategory) return null;

    play(XMB_AUDIO_SRC);

    const maxY = currentCategory.items.length - 1;

    const nextY = y + 1;
    if (nextY > maxY) return null;

    updateY(nextY);

    return positionRef.current;
  }, [currentCategory, y, updateY]);

  const moveBottom = useCallback(() => {
    if (!currentCategory) return null;

    play(XMB_AUDIO_SRC);

    const max = currentCategory.items.length - 1;

    if (y === max) return null;

    updateY(max);

    return positionRef.current;
  }, [currentCategory, y, updateY]);

  const moveLeft = useCallback(() => {
    if (!categories) return null;

    play(XMB_AUDIO_SRC);

    const nextX = x - 1;

    // can't move left, ignore
    if (nextX < 0) return null;

    updateX(nextX);

    return positionRef.current;
  }, [x, categories, updateX]);

  const moveFirst = useCallback(() => {
    if (!categories) return null;

    play(XMB_AUDIO_SRC);

    const nextX = 0;

    // can't move left, ignore
    if (x === nextX) return null;

    updateX(nextX);

    return positionRef.current;
  }, [x, categories, updateX]);

  const moveRight = useCallback(() => {
    if (!categories) return null;

    play(XMB_AUDIO_SRC);

    const max = categories.length - 1;
    const nextX = x + 1;

    // can't move right, ignore
    if (nextX > max) return null;

    updateX(nextX);

    return positionRef.current;
  }, [x, categories, updateX]);

  const moveLast = useCallback(() => {
    if (!categories) return null;
    play(XMB_AUDIO_SRC);

    const max = categories.length - 1;

    // can't move right, ignore
    if (x >= max) return null;

    updateX(max);

    return positionRef.current;
  }, [x, categories, updateX]);

  const actions = new Map<string, KeyPressAction>();

  actions.set('w', { repeat: true, onKeyPress: moveUp });
  actions.set('arrowup', { repeat: true, onKeyPress: moveUp });
  actions.set('a', { repeat: true, onKeyPress: moveLeft });
  actions.set('arrowleft', { repeat: true, onKeyPress: moveLeft });
  actions.set('s', { repeat: true, onKeyPress: moveDown });
  actions.set('arrowdown', { repeat: true, onKeyPress: moveDown });
  actions.set('d', { repeat: true, onKeyPress: moveRight });
  actions.set('arrowright', { repeat: true, onKeyPress: moveRight });
  actions.set(' ', { repeat: false, onKeyPress: onEnter });
  actions.set('enter', { repeat: false, onKeyPress: onEnter });
  actions.set('escape', { repeat: false, onKeyPress: onEsc });
  actions.set('h', { repeat: false, onKeyPress: onHelp });
  actions.set('f1', { repeat: false, onKeyPress: onHelp });
  actions.set('q', { repeat: false, onKeyPress: moveFirst });
  actions.set('e', { repeat: false, onKeyPress: moveLast });
  actions.set('z', { repeat: false, onKeyPress: moveTop });
  actions.set('x', { repeat: false, onKeyPress: moveBottom });

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
    onDPadUp: moveUp,
    onDPadDown: moveDown,
    onDPadLeft: moveLeft,
    onDPadRight: moveRight,
    onLeftStickUp: moveUp,
    onLeftStickDown: moveDown,
    onLeftStickLeft: moveLeft,
    onLeftStickRight: moveRight,
    onRightStickUp: moveUp,
    onRightStickDown: moveDown,
    onRightStickLeft: moveLeft,
    onRightStickRight: moveRight,
    onStart: onEnter,
    onSelect: onHelp,
    onLT: moveTop,
    onRT: moveBottom,
    onLB: moveFirst,
    onRB: moveLast,
  });

  const wheelInput: WheelInput = {
    onWheelUp: moveUp,
    onWheelDown: moveDown,
    onWheelLeft: moveLeft,
    onWheelRight: moveRight,
    enabledOnModal: false,
  };
  useWheel(wheelInput);

  const swipeInput: SwipeInput = {
    onSwipedDown: moveUp,
    onSwipedUp: moveDown,
    onSwipedRight: moveLeft,
    onSwipedLeft: moveRight,
    enabledOnModal: false,
  };
  useSwipe(swipeInput);

  const value = {
    x,
    y,
    menu: xmbMenuRef.current,
    currentCategory,
    currentItem,
    currentItems,
    openInNewTab,
    openItem,
    categories,
    toXmbKey,
  };

  return (
    <XmbContext.Provider value={value}>
      {children}
    </XmbContext.Provider>
  );
}

export function useXmb() {
  const context = useContext(XmbContext);
  if (!context) {
    throw new Error("useSecret must be used within a SecretProvider");
  }
  return context;
}

"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useWheel, { WheelInput } from "@hooks/useWheel";
import useKeyboard, { KeyPressAction } from "@hooks/useKeyboard";
import usePath from "@hooks/usePath";
import useSwipe, { SwipeInput } from "@hooks/useSwipe";
import { useAudio } from '@context/AudioContext';
import { Position, XmbCategory, XmbItem, XmbMenu } from "types";
import build from "@services/menuBuilder";
import { useGamepads } from "awesome-react-gamepads";
import { useSnackbar } from "./SnackbarContext";

// TODO: this context will need to be all of the state from the xmbmenu class
export interface XmbContextType {
  menu: XmbMenu | null;
  currentCategory: XmbCategory | null;
  currentItem: XmbItem | null;
  currentItems: XmbItem[] | null;
  x: number;
  y: number;
  updateX: (newX: number) => void;
  updateY: (newY: number) => void;
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
  const { modal } = usePath();

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
    if (!item.link) return;

    if (item.link.startsWith('/')) {
      router.push(item.link);
      return;
    }

    openInNewTab(item.link);

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
  }, [modal]);

  const openHelp = useCallback(() => {
    play(XMB_AUDIO_SRC);

    router.push('/help');
  }, []);

  const onHelp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openHelp();
  }, []);

  const moveUp = useCallback(() => {
    if (modal) return;

    const nextY = y - 1;

    play(XMB_AUDIO_SRC);

    if (nextY < 0) return null;

    updateY(nextY);

    return positionRef.current;
  }, [y, updateY, modal]);

  const moveTop = useCallback(() => {
    if (modal) return;

    const nextY = 0;

    play(XMB_AUDIO_SRC);

    if (y === nextY) return null;

    updateY(nextY);

    return positionRef.current;
  }, [y, updateY, modal]);

  const moveDown = useCallback(() => {
    if (modal) return;
    if (!currentCategory) return null;

    play(XMB_AUDIO_SRC);

    const maxY = currentCategory.items.length - 1;

    const nextY = y + 1;
    if (nextY > maxY) return null;

    updateY(nextY);

    return positionRef.current;
  }, [currentCategory, y, updateY, modal]);

  const moveBottom = useCallback(() => {
    if (modal) return;
    if (!currentCategory) return null;

    play(XMB_AUDIO_SRC);

    const max = currentCategory.items.length - 1;

    if (y === max) return null;

    updateY(max);

    return positionRef.current;
  }, [currentCategory, y, updateY, modal]);

  const moveLeft = useCallback(() => {
    if (modal) return;
    if (!categories) return null;

    play(XMB_AUDIO_SRC);

    const nextX = x - 1;

    // can't move left, ignore
    if (nextX < 0) return null;

    updateX(nextX);

    return positionRef.current;
  }, [x, categories, updateX, modal]);

  const moveFirst = useCallback(() => {
    if (modal) return;
    if (!categories) return null;

    play(XMB_AUDIO_SRC);

    const nextX = 0;

    // can't move left, ignore
    if (x === nextX) return null;

    updateX(nextX);

    return positionRef.current;
  }, [x, categories, updateX, modal]);

  const moveRight = useCallback(() => {
    if (modal) return;
    if (!categories) return null;

    play(XMB_AUDIO_SRC);

    const max = categories.length - 1;
    const nextX = x + 1;

    // can't move right, ignore
    if (nextX > max) return null;

    updateX(nextX);

    return positionRef.current;
  }, [x, categories, updateX, modal]);

  const moveLast = useCallback(() => {
    if (modal) return;
    if (!categories) return null;

    play(XMB_AUDIO_SRC);

    const max = categories.length - 1;

    // can't move right, ignore
    if (x >= max) return null;

    updateX(max);

    return positionRef.current;
  }, [x, categories, updateX, modal]);

  const actions: Map<string, KeyPressAction> = useMemo(() => {
    const map = new Map<string, KeyPressAction>();

    map.set('w', { repeat: true, onKeyPress: moveUp });
    map.set('arrowup', { repeat: true, onKeyPress: moveUp });
    map.set('a', { repeat: true, onKeyPress: moveLeft });
    map.set('arrowleft', { repeat: true, onKeyPress: moveLeft });
    map.set('s', { repeat: true, onKeyPress: moveDown });
    map.set('arrowdown', { repeat: true, onKeyPress: moveDown });
    map.set('d', { repeat: true, onKeyPress: moveRight });
    map.set('arrowright', { repeat: true, onKeyPress: moveRight });
    map.set(' ', { repeat: false, onKeyPress: onEnter });
    map.set('enter', { repeat: false, onKeyPress: onEnter });
    map.set('escape', { repeat: false, onKeyPress: onEsc });
    map.set('h', { repeat: false, onKeyPress: onHelp });
    map.set('f1', { repeat: false, onKeyPress: onHelp });
    map.set('q', { repeat: false, onKeyPress: moveFirst });
    map.set('e', { repeat: false, onKeyPress: moveLast });
    map.set('z', { repeat: false, onKeyPress: moveTop });
    map.set('x', { repeat: false, onKeyPress: moveBottom });

    return map;
  }, [moveUp, moveDown, moveLeft, moveRight, onEnter, onEsc, onHelp, moveFirst, moveLast, moveTop, moveBottom]);

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
    onSelect: openHelp,
    onLT: moveTop,
    onRT: moveBottom,
    onLB: moveFirst,
    onRB: moveLast,
  });
  const wheelInput: WheelInput = useMemo(() => {
    return {
      onWheelUp: moveUp,
      onWheelDown: moveDown,
      onWheelLeft: moveLeft,
      onWheelRight: moveRight,
      enabledOnModal: false,
    };
  }, [moveUp, moveDown, moveLeft, moveRight]);
  useWheel(wheelInput);

  const swipeInput: SwipeInput = useMemo(() => {
    return {
      onSwipedDown: moveUp,
      onSwipedUp: moveDown,
      onSwipedRight: moveLeft,
      onSwipedLeft: moveRight,
      enabledOnModal: false,
    };
  }, [moveUp, moveDown, moveLeft, moveRight]);
  useSwipe(swipeInput);

  const value = useMemo(() => {
    return {
      x,
      y,
      updateX,
      updateY,
      menu: xmbMenuRef.current,
      currentCategory,
      currentItem,
      currentItems,
      openInNewTab,
      openItem,
      categories,
      toXmbKey,
    };
  }, [x, y, xmbMenuRef, currentCategory, currentItem,
    currentItems, openInNewTab, openItem, categories, toXmbKey]);

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

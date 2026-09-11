"use client";

import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useWheel, { WheelInput } from "@hooks/useWheel";
import useKeyboard, { KeyPressAction } from "@hooks/useKeyboard";
import usePath from "@hooks/usePath";
import useSwipe, { SwipeInput } from "@hooks/useSwipe";
import { useAudio } from '@context/AudioContext';
import { IXmbMenu, Position, IXmbCategory, IXmbItem, MenuItemType, XmbMenu, Category, XmbPosition } from "types";
import build from "@services/menu-builder";
import { useGamepads } from "awesome-react-gamepads";
import { useSnackbar } from "./SnackbarContext";
import { useSecret } from "@context";
import { useXmbStore } from "@stores/xmb-store";
import { useShallow } from "zustand/react/shallow";
import { convertToRecord } from "utils";
import { fg, reset, log } from "utils";

export interface XmbContextType {
  menu: IXmbMenu | null;
  category: Category | undefined;
  currentItem: IXmbItem | undefined;
  item: MenuItemType | undefined;
  currentItems: IXmbItem[] | null;
  x: number;
  updateX: (newX: number) => void;
  y: number;
  updateY: (newY: number) => void;
  openInNewTab: (url: string) => void;
  openItem: (item: IXmbItem) => void;
  toXmbKey: (x: number, y: number) => string;
}

export const toXmbKey = (x: number, y: number) => {
  return [x, y].join(',');
};

export const openInNewTab = (url: string) => {
  if (!window) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const defaultMenu: XmbMenu = build();

const defPos: Position = { x: 0, y: 0 } as const;

const XMB_AUDIO_SRC = "/audio/nav.mp3";
const XMB_AUDIO_ENTER_SRC = "/audio/ps3/ok_enter.mp3";
const XMB_AUDIO_CANCEL_SRC = "/audio/ps3/ok_cancel.mp3";

const XmbContext = createContext<XmbContextType | undefined>(undefined);

export function XmbProvider({ children }: { children: React.ReactNode }) {

  const router = useRouter();
  const x = useXmbStore((state) => state.x);
  const y = useXmbStore((state) => state.y);
  const item = useXmbStore((state) => state.item);
  const category = useXmbStore((state) => state.category);
  const cache = useXmbStore((state) => state.cache);

  const { setCategory, setItem, setX, setY, setCache } = useXmbStore(useShallow((state) =>
    ({ setCategory: state.setCategory, setItem: state.setItem, setX: state.setX, setY: state.setY, setCache: state.setCache })));
  const positionRef = useRef<XmbPosition>(new XmbPosition(0, 0));
  const xmbItemRef = useRef<Map<string, IXmbItem> | null>(null);
  const [categories, setCategories] = useState<Record<Category, IXmbCategory> | null>(null);
  const [currentItems, setCurrentItems] = useState<IXmbItem[] | null>(null);
  const [menu, setMenu] = useState<IXmbMenu | null>(null);
  const { play } = useAudio();
  const { showSnackbar } = useSnackbar();
  const { modal } = usePath();
  const { currentSecret } = useSecret();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const getCategory = useCallback((index: number) => {
    if (!categories) return undefined;
    return Object.values(categories).find(c => c.index === index);
  }, [categories]);

  const updateCache = () => {
    if (!menu) return;
    if (!positionRef.current) return;
    const cat = getCategory(x);
    if (!cat) return;
    setCache(cat.type, y);

    log.info(`Current position: ${fg.brightCyan}${positionRef.current.toString()}${reset}`);
  };

  useLayoutEffect(() => {
    updateCache();
  }, [menu, x, y]);

  // udpates the selected item (y)
  const updateY = useCallback((newY: number) => {
    const delta = newY - y;

    // look for the next valid y position in that direction
    const inc = delta < 0 ? -1 : 1;
    let found = false;
    // by default assume that this will be next item
    let i = newY;
    const items = currentItems!;
    let nextItem = items[newY];
    const isNextItemValid = nextItem && (nextItem.isEnabled && !nextItem.isHidden);

    if (!isNextItemValid) {
      do {
        nextItem = items[i];

        if (!nextItem) break;

        const isValid = nextItem.isEnabled
          && !nextItem.isHidden;

        if (isValid) {
          nextItem = nextItem;
          found = true;
        }

        // moves to the next item in that direction
        i = i + inc;

        if (i < 0) {
          log.warn(`No valid XMB items found while moving ${inc < 0 ? 'up' : 'down'}.`);
          break;
        }
      } while (!found);

      if (!found) {
        // if we could not find a valid item in that direction, just cancel the update
        return;
      }
    }

    if (!category) return;

    positionRef.current.y = i;
    setItem(nextItem.type);
    setY(i);

    // updateCache();
  }, [categories, category, y]);

  // udpates both the category (x) and restores the previous selected item (y)
  const updateX = useCallback((newX: number, loadCache: boolean = true) => {
    if (!categories) return;
    const nextCategory = getCategory(newX);
    const nextType = nextCategory?.type;
    let nextY = (loadCache && nextType)
      ? cache[nextType] ?? 0
      : 0;

    if (nextCategory && nextY) {
      if (nextY > nextCategory.items.length - 1) {
        nextY = nextCategory.items.length - 1;
      }
      if (nextY < 0) {
        nextY = 0;
      }
    }

    setX(newX);
    positionRef.current.update(newX, nextY);
    if (!nextCategory) return;
    setCategory(nextCategory?.type);
    setCurrentItems(nextCategory?.items);
    const nextItem = nextCategory?.items[nextY];
    setItem(nextItem?.type);
    updateY(nextY);
  }, [categories, category, updateY, cache, getCategory]);

  const openItem = useCallback((item: IXmbItem) => {
    if (!item.link) return;
    if (item.isHidden) return;
    if (!item.isEnabled) return;

    // updateCache();

    void play(XMB_AUDIO_ENTER_SRC);

    if (item.link.startsWith('/')) {
      router.push(item.link);
      return;
    }

    openInNewTab(item.link);
  }, []);

  const onEnter = useCallback(() => {
    if (!xmbItemRef.current) return;

    //void play(XMB_AUDIO_SRC);

    const key = toXmbKey(x, y);
    const item = xmbItemRef.current.get(key);

    if (!item) return;

    openItem(item);
  }, [x, y]);

  const processQueryParams = useCallback(() => {
    const itemParam = searchParams.get('item');
    if (!itemParam) return;

    const xmbItems = xmbItemRef.current;
    if (!xmbItems) return;

    const filteredItem = Object.values(xmbItems)
      .map(i => i as IXmbItem)
      .find((i) => i.type.equalsIgnoreCase(itemParam));

    if (!filteredItem) {
      log.warn(`Unknown item value '${itemParam}'.`);
      return;
    }

    log.info(`Requested item '${itemParam}' was found. Opening '${filteredItem?.link}'...`);

    openItem(filteredItem);

    router.replace(`${pathname}`, { scroll: false });
  }, [openItem]);

  useEffect(() => {
    xmbItemRef.current = new Map<string, IXmbItem>();

    const currentMenu = currentSecret?.menu ?? defaultMenu;
    const prevCategory = category;

    let catIndex = 0;

    if (prevCategory) {
      const match = currentMenu.items.find(c => c.type === prevCategory);
      if (match) {
        catIndex = match.index;
        log.info(`Restoring previously selected category (${match.index}: ${prevCategory}) after menu change.`);
      }
      else {
        // default to the first category if the one we had selected was removed
        log.warn(`Previously selected category '${prevCategory}' not found. Defaulting to the first category.`);
      }
    }

    setX(catIndex);
    setMenu(currentMenu);

    const cMap = new Map<Category, IXmbCategory>();

    currentMenu.items.forEach(c => {
      cMap.set(c.type, c);
    });

    const cats = convertToRecord(cMap);
    setCategories(cats);
    const cat = currentMenu.items[catIndex];
    setCategory(cat.type);
    setCurrentItems(cat.items);
    if (cat.items[0]) {
      setItem(cat.items[0].type);
    }

    // save the item ref to find items by key directly
    for (let i = 0; i < currentMenu.items.length; i++) {
      const cat = currentMenu.items[i];
      for (let j = 0; j < cat.items.length; j++) {
        const item = cat.items[j];
        xmbItemRef.current.set(toXmbKey(i, j), item);
      }
    }

    // after loading everything check and see if any query params were passed
    processQueryParams();
  }, [currentSecret]);

  const moveDefault = useCallback(() => {
    updateX(0, false);
    updateY(0);

    return defPos;
  }, [updateX, updateY]);

  const onEsc = useCallback(() => {
    if (!moveDefault()) return;

    void play(XMB_AUDIO_CANCEL_SRC);
  }, [play, moveDefault]);

  const onBack = useCallback(() => {
    if (!modal) return;

    void play(XMB_AUDIO_CANCEL_SRC);

    router.push('/');
  }, [modal, play]);

  const openHelp = useCallback(() => {
    void play(XMB_AUDIO_ENTER_SRC);

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

    void play(XMB_AUDIO_SRC);

    if (nextY < 0) return null;

    updateY(nextY);

    return positionRef.current;
  }, [y, updateY, modal]);

  const moveTop = useCallback(() => {
    if (modal) return;

    const nextY = 0;

    void play(XMB_AUDIO_SRC);

    if (y === nextY) return null;

    updateY(nextY);

    return positionRef.current;
  }, [y, updateY, modal]);

  const moveDown = useCallback(() => {
    if (modal) return;
    if (!category) return;
    const cat = categories?.[category];

    if (!cat) return null;

    void play(XMB_AUDIO_SRC);

    const maxY = cat.items.length - 1;

    const nextY = y + 1;
    if (nextY > maxY) return null;

    updateY(nextY);

    return positionRef.current;
  }, [category, categories, y, updateY, modal]);

  const moveBottom = useCallback(() => {
    if (modal) return;
    if (!category) return;
    const cat = categories?.[category];

    if (!cat) return null;

    void play(XMB_AUDIO_SRC);

    const max = cat.items.length - 1;

    if (y === max) return null;

    updateY(max);

    return positionRef.current;
  }, [category, y, updateY, modal]);

  const moveLeft = useCallback(() => {
    if (modal) return;
    if (!categories) return null;

    void play(XMB_AUDIO_SRC);

    const nextX = x - 1;

    // can't move left, ignore
    if (nextX < 0) return null;

    updateX(nextX);

    return positionRef.current;
  }, [x, categories, updateX, modal]);

  const moveFirst = useCallback(() => {
    if (modal) return;
    if (!categories) return null;

    void play(XMB_AUDIO_SRC);

    const nextX = 0;

    // can't move left, ignore
    if (x === nextX) return null;

    updateX(nextX);

    return positionRef.current;
  }, [x, categories, updateX, modal]);

  const moveRight = useCallback(() => {
    if (modal) return;
    if (!categories) return null;

    void play(XMB_AUDIO_SRC);

    const max = Object.values(categories).length - 1;
    const nextX = x + 1;

    // can't move right, ignore
    if (nextX > max) return null;

    updateX(nextX);

    return positionRef.current;
  }, [x, categories, updateX, modal]);

  const moveLast = useCallback(() => {
    if (modal) return;
    if (!categories) return null;

    void play(XMB_AUDIO_SRC);

    const max = Object.values(categories).length - 1;

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
      onSwipeDown: moveUp,
      onSwipeUp: moveDown,
      onSwipeRight: moveLeft,
      onSwipeLeft: moveRight,
      enabledOnModal: false,
    };
  }, [moveUp, moveDown, moveLeft, moveRight]);
  useSwipe(swipeInput);

  const value = useMemo(() => {
    return {
      x,
      updateX,
      y,
      updateY,
      menu,
      category,
      currentItem: currentItems?.find(i => i.type === item),
      item: item as MenuItemType,
      currentItems,
      openInNewTab,
      openItem,
      categories,
      toXmbKey,
    };
  }, [x, y, menu, category, item, category,
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

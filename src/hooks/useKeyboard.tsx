'use client';

import { useCallback, useEffect, useState } from "react";
import usePath from "./usePath";
import { useActiveElement } from "./useActiveElement";

export type StandardVoidFn = () => void;
export type KeyboardEventFn = (e: KeyboardEvent) => void;
export type KeyEventHandler = KeyboardEventFn | StandardVoidFn;

// The type guard
export const isKeyboardHandler = (fn: KeyEventHandler): fn is KeyboardEventFn => fn.length >= 1;

export interface KeyPressAction {
    repeat: boolean;
    onKeyPress: KeyEventHandler;
}

export interface KeyboardInput {
    actions: Map<string, KeyPressAction>;
    enabledOnModal: boolean | undefined;
}

export interface KeyboardOutput {
    onKeyUp: (e: KeyboardEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
}

export const useKeyboard = ({ actions, enabledOnModal = false }: KeyboardInput): KeyboardOutput => {
  const [keysDown, setKeysDown] = useState<string[]>([]);
  const { modal } = usePath();
  const { isInput } = useActiveElement();

  const isMapped = useCallback((key: string): boolean => {
    return actions.has(key.toLowerCase());
  }, [actions]);

  const handleKeyUp = useCallback((e: KeyboardEvent): void => {
    // key is not mapped, ignore
    if (!isMapped(e.key)) return;

    if (modal && !enabledOnModal) return;

    //e.stopPropagation();
    //e.preventDefault();
    const updated = keysDown.filter((i) => i !== e.key);
    setKeysDown(updated);

    console.log(`keyup: ${e.key}`);
  }, [keysDown]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // key is not mapped, ignore
    if (!isMapped(e.key)) return;

    if (modal && !enabledOnModal) return;

    // key is mapped, so retrieve the KeyPressAction
    const action = actions.get(e.key.toLowerCase());

    // TODO: this should throw an error
    if (action === undefined) return;

    // if this is a repeat and we don't allow repeats
    if (e.repeat && !action.repeat) return;

    console.log(`keydown: ${e.key} => ${action.onKeyPress.name}()`);

    const executeHandler = (
      fn: KeyEventHandler,
      event: KeyboardEvent,
    ) => {
      if (isKeyboardHandler(fn)) {
        fn(event); // TypeScript safely knows this needs the event
      } else {
        (fn as StandardVoidFn)();      // TypeScript safely knows this takes zero arguments
      }
    };

    executeHandler(action.onKeyPress, e);

    setKeysDown((prevState) => [...prevState, e.key]);
  }, [actions, isMapped, modal, isInput]);

  useEffect(() => {
    if (modal && !enabledOnModal) return;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp, handleKeyDown, modal]);

  return {
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
  };
};

export { useKeyboard as default };

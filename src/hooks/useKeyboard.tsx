'use client';

import { ReadonlyURLSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import useQuery from "./useQuery";

export interface KeyPressAction {
    repeat: boolean;
    onKeyPress: () => void;
}

export interface KeyboardInput {
    actions: Map<string, KeyPressAction>;
    enabledOnModal: boolean | undefined;
}

export interface KeyboardOutput {
    onKeyUp: (e: KeyboardEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
}

const useKeyboard = ({ actions, enabledOnModal = false }: KeyboardInput): KeyboardOutput => {
  const [keysDown, setKeysDown] = useState<string[]>([]);
  const [modal, setModal] = useState<boolean>(false);

  function onPathChanged(p: string, s: ReadonlyURLSearchParams, m: string | null) {
    setModal(!!m);
  }

  useQuery({ onPathChanged: onPathChanged });

  const isMapped = useCallback((key: string): boolean => {
    return actions.has(key.toLowerCase());
  }, [actions]);

  const handleKeyUp = useCallback((e: KeyboardEvent): void => {
    // key is not mapped, ignore
    if (!isMapped(e.key)) return;

    //e.stopPropagation();
    //e.preventDefault();
    const updated = keysDown.filter((i) => i !== e.key);
    setKeysDown(updated);

    console.log(`keyup: ${e.key}`);
  }, [keysDown]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // key is not mapped, ignore
    if (!isMapped(e.key)) return;

    //e.stopPropagation();
    //e.preventDefault();

    // key is mapped, so retrieve the KeyPressAction
    const action = actions.get(e.key.toLowerCase());

    // TODO: this should throw an error
    if (action === undefined) return;

    // if this is a repeat and we don't allow repeats
    if (e.repeat && !action.repeat) return;

    console.log(`keydown: ${e.key} => ${action.onKeyPress.name}()`);

    action.onKeyPress();

    setKeysDown((prevState) => [...prevState, e.key]);
  }, [actions, isMapped]);

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

export default useKeyboard;

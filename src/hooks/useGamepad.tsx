'use client'

import { ReadonlyURLSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import useQuery from "./useQuery";
import { KeyPressAction } from "@components/types";

export interface GamepadInput {
    actions: Map<string, KeyPressAction>;
    enabledOnModal: boolean | undefined;
}

export interface GamepadOutput {
    gamepad: Gamepad;
    onConnected: (e: GamepadEvent) => void;
    onDisconnected: (e: GamepadEvent) => void;
}

const useGamepad = ({ actions, enabledOnModal = false }: GamepadInput): GamepadOutput => {
    const [keysDown, setKeysDown] = useState<string[]>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [gamepad, setGamepad] = useState<Gamepad>();

    function onPathChanged(p: string, s: ReadonlyURLSearchParams, m: string | null) {
      setModal(!!m);
    }
  
    useQuery({ onPathChanged: onPathChanged });
  
    const isMapped = useCallback((button: string): boolean => {
      return actions.has(button.toLowerCase());
    }, [actions]);

    const handleGamepadConnected = useCallback((e: GamepadEvent): void => {

    }, [gamepad]);

    const handleGamepadDisconnected = useCallback((e: GamepadEvent): void => {

    });

    const handleKeyUp = useCallback((e: KeyboardEvent): void => {
      const updated = keysDown.filter((i) => i !== e.key);
      setKeysDown(updated);
    }, [keysDown, setKeysDown]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      // key is not mapped, ignore
      if (!isMapped(e.key)) return;

      // key is mapped, so retrieve the KeyPressAction
      const action = actions.get(e.key.toLowerCase());

      // TODO: this should throw an error
      if (action === undefined) return;

      // if this is a repeat and we don't allow repeats
      if (e.repeat && !action.repeat) return;

      e.preventDefault();

      action.onKeyPress();

      setKeysDown((prevState) => [...prevState, e.key]);
    }, [actions, isMapped]);

    useEffect(() => {
      if (modal && !enabledOnModal) return;

      document.body.addEventListener('gamepadconnected', handleKeyDown);
      document.body.addEventListener('keyup', handleKeyUp);

      return () => {
        document.body.removeEventListener('keydown', handleKeyDown);
        document.body.removeEventListener('keyup', handleKeyUp);
      }
    }, [handleKeyUp, handleKeyDown, modal, enabledOnModal]);

    return {
      onConnected: handleGamepadConnected,
      onDisconnected: handleGamepadDisconnected,
    };
};

export default useKeyboard;

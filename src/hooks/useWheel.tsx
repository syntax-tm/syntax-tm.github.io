"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { ReadonlyURLSearchParams } from "next/navigation";
import useQuery from "./useQuery";

export interface WheelInput {
  onWheelUp: () => void;
  onWheelDown: () => void;
  onWheelLeft: () => void;
  onWheelRight: () => void;
  enabledOnModal: boolean | undefined;
}

export interface WheelOutput {
  onWheel: (e: WheelEvent) => void;
  onKeyUp: (e: KeyboardEvent) => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

const useWheel = ({ onWheelUp, onWheelDown, onWheelLeft, onWheelRight, enabledOnModal = false }: WheelInput): WheelOutput => {

  //const [shift, setShift] = useState(false);

  const shift = useRef(false);

  //const [path, setPath] = useState('');
  //const [searchParams, setSearchParams] = useState<ReadonlyURLSearchParams | null>(null);
  const [modal, setModal] = useState<boolean>(false);

  const onPathChanged = (p: string, s: ReadonlyURLSearchParams, m: string | null) => {
    //setPath(p);
    //setSearchParams(s);
    setModal(!!m);
  };

  useQuery({ onPathChanged: onPathChanged });

  const onWheel = (e: WheelEvent) => {
    const down = e.deltaY > 0;
    if (down) {
      if (shift.current) {
        console.log(`wheelright: ${onWheelLeft.name}()`);
        onWheelRight();
        return;
      }
      console.log(`wheeldown: ${onWheelLeft.name}()`);
      onWheelDown();
      return;
    }
    if (shift.current) {
      console.log(`wheelleft: ${onWheelLeft.name}()`);
      onWheelLeft();
      return;
    }
    console.log(`wheelup: ${onWheelLeft.name}()`);
    onWheelUp();
  };

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key !== 'Shift') return;
    e.preventDefault();
    e.stopPropagation();
    shift.current = true;
  });

  const onKeyUp = useEffectEvent((e: KeyboardEvent) => {
    if (e.key !== 'Shift') return;
    e.preventDefault();
    e.stopPropagation();
    shift.current = false;
  });

  useEffect(() => {
    if (modal && !enabledOnModal) return;
    document.body.addEventListener('wheel', onWheel);
    document.body.addEventListener('keydown', onKeyDown);
    document.body.addEventListener('keyup', onKeyUp);
    return () => {
      document.body.removeEventListener('wheel', onWheel);
      document.body.removeEventListener('keydown', onKeyDown);
      document.body.removeEventListener('keyup', onKeyUp);
    };
  }, [modal, enabledOnModal, onWheel, onKeyDown, onKeyUp]);

  return {
    onWheel,
    onKeyDown,
    onKeyUp,
  };
};

export default useWheel;

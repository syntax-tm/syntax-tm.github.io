"use client";

import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useAudio } from "@context/AudioContext";
import useInput from "@hooks/useInput";
import useKeyboard from "@hooks/useKeyboard";
import ControllerIcon from "@components/icons/controller-icon";
import { KeyPressAction } from "types";
import "./modal.css";

const AUDIO_SRC = '/audio/nav.mp3';

export function ModalClose() {
  const router = useRouter();
  const { isGamepad, isMobile, isDesktop } = useInput();

  const { play } = useAudio();

  const onEsc = useCallback(async () => {
    await play(AUDIO_SRC);
    router.push('/');
  }, []);

  const actions: Map<string, KeyPressAction> = useMemo(() => {
    const newActions = new Map<string, KeyPressAction>();
    newActions.set('escape', { repeat: false, onKeyPress: onEsc });
    return newActions;
  }, [onEsc]);

  useKeyboard({ actions: actions, enabledOnModal: true });

  return (
    <div className="w-full h-[15%] absolute bottom-0 left-0">
      <div className="relative contents">
        <hr className="absolute top-0 w-full" />
        <div className="grid justify-center">
          <span className="text-white mt-[1em] ml-[0.5em] text-center modal-action object-center mx-auto">
            {/* need to set the href so that the user can close modal by clicking on the buttton */}
            <Link href="/" >
              {isGamepad && (
                <div className="text-xl items-center justify-items-center align-items-center inline-flex select-none">
                  <div className="relative max-w-10">
                    <ControllerIcon icon="b" className="m-2" />
                  </div>
                  <span className="mx-2 my-auto">close</span>
                </div>
              )
              }
              {isMobile && (
                <div className="text-xl items-center justify-items-center align-items-center inline-flex select-none">
                  <FontAwesomeIcon icon={faClose} className="w-7 h-7 aspect-square inline-flex my-auto modal-action" />
                  <span className="mx-2 my-auto">close</span>
                </div>
              )}
              {isDesktop && (
                <div className="justify-between w-auto mt-4 text-lg hover:animate-pulse select-none">
                  <kbd className="px-2 py-1.5 text-gray-800 bg-gray-100 mx-0.75 border border-gray-200 rounded-lg dark:bg-gray-400/25 dark:text-white dark:border-gray-500/25">Esc</kbd>
                  <span className="mx-2 my-auto">close</span>
                </div>
              )}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export function ModalHeader({ title }: { title: string }) {
  return (
    <div className="w-full h-[15%] absolute top-0 left-0">
      <div className="relative contents">
        <div className="modal-title text-xl mx-3 h-full flex items-end">
          <span className="inline-block align-text-bottom text-white my-2">{title}</span>
        </div>
        <hr className="row w-full absolute bottom-0 left-0" />
      </div>
    </div>
  );
}

export function Modal({ title, children }: { title: string, children: React.ReactNode }) {

  const modalClass = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`modal modal-${modalClass} fixed left-0 top-0 z-25 flex flex-col h-full w-full`}>
      <div className="grid grid-cols-1 absolute left-0 top-0 w-screen h-screen z-25 overflow-none backdrop-blur-xl bg-stone-900/70">
        <ModalHeader title={title} />
        <div className="grid absolute top-[15%] left-0 w-full h-[70%] overflow-y-auto overscroll-contain">
          {children}
        </div>
        <ModalClose />
      </div>
    </div>
  );
}

export { Modal as default };

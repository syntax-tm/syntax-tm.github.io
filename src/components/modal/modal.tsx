"use client";

import React, { useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useAudio } from "@context/AudioContext";
import useInput from "@hooks/useInput";
import useKeyboard from "@hooks/useKeyboard";
import ControllerIcon, { ControllerButton } from "@components/icons/controller-icon";
import { KeyPressAction } from "types";
import "./modal.css";
import { useActiveElement } from "@hooks/useActiveElement";

const AUDIO_SRC = '/audio/nav.mp3';

export interface ModalMenuInputItem {
  title: string;
  description: string;
  action: () => void;
}

export interface ModalMenuButton {
  title: string;
  description: string;
  key: string;
  url?: string;
  action?: () => void;
  icon?: React.ReactNode;
  controllerIcon: ControllerButton;
  mobileIcon: IconDefinition;
}

export function ModalMenu() {

}

export function ModalClose({ menuButton }: { menuButton?: ModalMenuButton }) {
  const router = useRouter();
  const menuButtonRef = useRef<HTMLAnchorElement | null>(null);
  const { isGamepad, isMobile, isDesktop } = useInput();

  const { play } = useAudio();

  const onEsc = useCallback(async () => {
    await play(AUDIO_SRC);
    router.push('/');
  }, [play, router]);

  const onMenuItemClick = useCallback(() => {
    if (!menuButton) return;

    if (menuButton.url) {
      router.push(menuButton.url);
    }
    else if (menuButton.action) {
      menuButton.action();
    }
  }, [menuButton, router]);

  const actions: Map<string, KeyPressAction> = useMemo(() => {
    const newActions = new Map<string, KeyPressAction>();
    newActions.set('escape', { repeat: false, onKeyPress: onEsc });

    if (menuButton) {
      newActions.set(menuButton.key, { repeat: false, onKeyPress: onMenuItemClick });
    }

    return newActions;
  }, [onEsc, menuButton, onMenuItemClick]);

  useKeyboard({ actions: actions, enabledOnModal: true });

  return (
    <div className="w-full h-[15%] absolute bottom-0 left-0">
      <div className="relative contents">
        <hr className="absolute top-0 w-full" />
        <div className="flex align-middle justify-evenly md:justify-center mt-10 gap-5 xl:gap-30">
          {
            isGamepad && (
              <>
                {
                  menuButton?.controllerIcon && (
                    <div className="modal-action grid text-white text-center object-center my-auto">
                      <Link href={menuButton.url ?? ''} onClick={onMenuItemClick}
                        className=""
                        ref={menuButtonRef}>
                        <div className="items-center justify-items-center align-items-center inline-flex select-none my-auto">
                          <div className="relative max-w-10">
                            <ControllerIcon icon={menuButton.controllerIcon} className="m-2" />
                          </div>
                          <span className="mx-2 my-auto">{menuButton.title}</span>
                        </div>
                      </Link>
                    </div>
                  )
                }
                <div className="modal-action grid text-white text-center object-center my-auto">
                  {/* need to set the href so that the user can close modal by clicking on the buttton */}
                  <Link href="/" >
                    <div className="text-xl items-center justify-items-center align-items-center inline-flex select-none my-auto">
                      <div className="relative max-w-10">
                        <ControllerIcon icon="b" className="m-2" />
                      </div>
                      <span className="mx-2 my-auto">close</span>
                    </div>
                  </Link>
                </div>
              </>
            )
          }
          {
            isMobile && (
              <>
                {
                  menuButton?.mobileIcon && (
                    <div className="modal-action grid text-white text-center object-center my-auto">
                      <Link href={menuButton.url ?? ''} onClick={menuButton.action}
                        className=""
                        ref={menuButtonRef}>
                        <div className="items-center justify-items-center align-items-center inline-flex select-none my-auto">
                          <FontAwesomeIcon icon={menuButton.mobileIcon} className="w-7 h-7 aspect-square inline-flex my-auto max-w-10" />
                          <span className="mx-2 my-auto">{menuButton.title}</span>
                        </div>
                      </Link>
                    </div>
                  )
                }
                <div className="modal-action grid text-white text-center object-center my-auto">
                  {/* need to set the href so that the user can close modal by clicking on the buttton */}
                  <Link href="/" >
                    <div className="text-xl items-center justify-items-center align-items-center inline-flex select-none my-auto">
                      <FontAwesomeIcon icon={faClose} className="w-7 h-7 aspect-square inline-flex my-auto max-w-10" />
                      <span className="mx-2 my-auto">close</span>
                    </div>
                  </Link>
                </div>
              </>
            )
          }
          {
            isDesktop && (
              <>
                {
                  menuButton?.key && (
                    <div className="modal-action grid text-white text-center object-center my-auto">
                      <Link href={menuButton.url ?? ''} onClick={menuButton.action}
                        className=""
                        ref={menuButtonRef}>
                        <div className="items-center justify-items-center align-items-center inline-flex select-none my-auto">
                          <kbd className="h-9 w-13 px-2 py-1.5 text-gray-800 bg-gray-100 mx-0.75 border border-gray-200 rounded-lg dark:bg-gray-400/25 dark:text-white dark:border-gray-500/25">
                            {menuButton.key.toUpperCase()}
                          </kbd>
                          <span className="mx-2 my-auto">{menuButton.title}</span>
                        </div>
                      </Link>
                    </div>
                  )
                }
                <div className="modal-action grid text-white text-center object-center my-auto">
                  {/* need to set the href so that the user can close modal by clicking on the buttton */}
                  <Link href="/" >
                    <div className="justify-between align-items-center text-lg hover:animate-pulse select-none my-auto">
                      <kbd className="h-9 w-13 px-2 py-1.5 text-gray-800 bg-gray-100 mx-0.75 border border-gray-200 rounded-lg dark:bg-gray-400/25 dark:text-white dark:border-gray-500/25">Esc</kbd>
                      <span className="mx-2 my-auto">close</span>
                    </div>
                  </Link>
                </div>
              </>
            )
          }
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

export function Modal({ title, menuButton, children }: { title: string, menuButton?: ModalMenuButton, children: React.ReactNode }) {

  const modalClass = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`modal modal-${modalClass} fixed left-0 top-0 z-25 flex flex-col h-full w-full`}>
      <div className="grid grid-cols-1 absolute left-0 top-0 w-screen h-screen z-25 overflow-none backdrop-blur-xl bg-stone-900/70">
        <ModalHeader title={title} />
        <div className="grid absolute top-[15%] left-0 w-full h-[70%] overflow-y-auto overscroll-contain">
          {children}
        </div>
        <ModalClose menuButton={menuButton} />
      </div>
    </div>
  );
}

export { Modal as default };

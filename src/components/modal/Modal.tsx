"use client";

import React from "react";
import useInput from "@hooks/useInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InputType } from "../../app/enums";
import { useAudio } from "@context/AudioContext";
import { KeyPressAction } from "@components/types";
import useKeyboard from "@hooks/useKeyboard";
import ControllerIcon from "@components/icons/controller-icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import BackgroundView from "@components/background/background-view";
import Clock from "@components/clock/clock";
import Menu from "@components/xmb-menu/xmb-menu";
import "./modal.css";

const AUDIO_SRC = '/audio/nav.mp3';

export function ModalClose() {
  const router = useRouter();
  const inputType = useInput();
  const isGamepad = inputType === InputType.GAMEPAD;
  const isMobile = inputType === InputType.TOUCH;
  const isDesktop = inputType === InputType.DEFAULT;

  const { play } = useAudio();

  async function onEsc() {
    await play(AUDIO_SRC);

    router.push('/');
  }

  const actions = new Map<string, KeyPressAction>();

  actions.set('escape', { repeat: false, onKeyPress: onEsc });

  useKeyboard({ actions: actions, enabledOnModal: true });

  return (
    <div className="w-full h-[15%] relative">
      <div className="relative contents">
        <hr className="absolute top-0 w-full" />
        <div className="grid justify-center">
          <span className="text-white mt-[1em] ml-[0.5em] text-center modal-action object-center mx-auto">
            {/* need to set the href so that the user can close modal by clicking on the buttton */}
            <Link href="/">
              {isGamepad && (
                <div className="text-xl items-center justify-items-center align-items-center inline-flex">
                  <div className="relative max-w-10">
                    <ControllerIcon icon="b" className="m-2" />
                  </div>
                  <span className="mx-2 my-auto">close</span>
                </div>
              )
              }
              {isMobile && (
                <div className="text-xl items-center justify-items-center align-items-center inline-flex">
                  <FontAwesomeIcon icon={faClose} className="w-7 h-7 aspect-square inline-flex my-auto modal-action" />
                  <span className="mx-2 my-auto">close</span>
                </div>
              )}
              {isDesktop && (
                <div className="justify-between w-auto mt-4 text-lg hover:animate-pulse">
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
    <div className="w-full h-[15%] relative">
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
  return (
    <>
      <div className="root-container">
        <BackgroundView />
        <Clock />
        <Menu />
        <div className="fixed left-0 top-0 z-100 flex flex-col h-full w-full">
          <div className="flex flex-col w-screen h-screen bg-black/75 z-100 overflow-none backdrop-blur">
            <ModalHeader title={title} />
            {children}
            <ModalClose />
          </div>
        </div>
      </div>
    </>
  );
}

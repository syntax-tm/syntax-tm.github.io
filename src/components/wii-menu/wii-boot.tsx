'use client';

import { useAudio, useBoot, useTheme } from "@context";
import React, { useEffect, useRef, useState } from "react";
import Ps1LogoImage from "image/ps1.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import ControllerIcon from "@components/icons/controller-icon";
import "./wii-boot.scss";
import "./cursors.css";

const WII_MENU_START_AUDIO_SRC = 'audio/wii/menu_select_start.mp3';

export function WiiBoot() {

  const { isBootVisible, hideBootScreen } = useBoot();
  const { play } = useAudio();

  useEffect(() => {
    //void play(PS1_BOOT_AUDIO_SRC);

    const completeBoot = () => {
      play(WII_MENU_START_AUDIO_SRC).then(() => {
        hideBootScreen();
      }).catch((e) => {
        console.error('An error occurred handling user input in the Wii boot component. ', e);
      });
    };

    const onUserInput = () => {
      completeBoot();
    };

    // document.addEventListener('click', onUserInput);
    // document.addEventListener('mousedown', onUserInput);
    // document.addEventListener('mouseup', onUserInput);
    // document.addEventListener('pointerdown', onUserInput);
    // document.addEventListener('pointerup', onUserInput);
    document.addEventListener('dblclick', onUserInput);
    document.addEventListener('touchstart', onUserInput);
    document.addEventListener('touchend', onUserInput);

    return () => {
      // document.removeEventListener('click', onUserInput);
      // document.removeEventListener('mousedown', onUserInput);
      // document.removeEventListener('mouseup', onUserInput);
      // document.removeEventListener('pointerdown', onUserInput);
      // document.removeEventListener('pointerup', onUserInput);
      document.removeEventListener('dblclick', onUserInput);
      document.removeEventListener('touchstart', onUserInput);
      document.removeEventListener('touchend', onUserInput);
    };

  }, []);
  // cursor-(--cursor-wii-auto)
  return true && (
    <>
      <div className="wii-boot text-white bg-black text-center text-[clamp(1rem,3vw,8rem)] flex items-center cursor-[url(/cursors/wii/move.png),_pointer] pointer-events-none select-none">
        <div className="grid grid-cols-1 absolute left-0 top-0 w-full h-full">
          <div className="place-content-center flex flex-col gap-10">
            <div className="flex flex-row place-content-center">
              <FontAwesomeIcon icon={faWarning} className="my-auto scale-200 mr-5" />
              <span className="text-[clamp(1rem,5vw,12rem)]">WARNING-HEALTH AND SAFETY</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="">BEFORE PLAYING, READ YOUR OPERATIONS</span>
              <span className="">MANUAL FOR IMPORTANT INFORMATION</span>
              <span className="">ABOUT YOUR HEALTH AND SAFETY.</span>
            </div>
            <div className="flex flex-col items-center justify-center align-middle">
              <span>Also online at</span>
              <span className="text-[clamp(1rem,3.5vw,8rem)]">www.nintendo.com/healthsafety/</span>
            </div>
            <div className="wii-boot-instructions flex flex-row place-content-center object-scale-down relative">
              <span className="">Press</span>
              <div className="relative h-full aspect-square mx-5">
                <Image src={'svg/wii/a.svg'} fill className="scale-130 align-middle object-cover self-center mt-1" alt="a" />
              </div>
              <span className="">to continue.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { WiiBoot as default };


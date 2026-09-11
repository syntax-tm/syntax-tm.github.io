"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useMobileDetect from "@hooks/useMobileDetect";
import { Modal } from "@components/modal/modal";
import { useSettingStore } from "@stores";
import { useAudio, useSecret } from "@context";
import { getMacAddresses } from "utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import { useKeyboard } from "@hooks";
import { useRouter } from "next/navigation";
import { KeyPressAction } from "types";
import { useGamepad, useGamepads } from "awesome-react-gamepads";

const AUDIO_SRC = '/audio/nav.mp3';

function isMultiLine(text: string | undefined) {
  if (text === undefined) return false;
  return /\n/.test(text);
}

function getLines(text: string | undefined): string[] {
  if (text === undefined) return [];
  return text.split(/\r?\n/);
}

const displayItems: Record<string, string | undefined> = {
  "Author": "Trey (@syntax-tm)",
  "Name": process.env.name,
  "Version": process.env.version,
  "Description": process.env.description,
  "Next.js": process.env.NEXT_PUBLIC_NEXTJS_VERSION,
  "Package Manager": process.env.packageManger,
  "Build Date": `${process.env.NEXT_PUBLIC_BUILD_DATE_LOCAL} ${process.env.NEXT_PUBLIC_BUILD_TIME_LOCAL} ${process.env.NEXT_PUBLIC_TZ_SHORT}`,
  "Dependencies": process.env.dependencies,
};

const SECRET_TAP_MIN = 5;

function AboutView() {
  const mobileDetect = useMobileDetect();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<number | null>(null);
  const { unlock } = useSettingStore("ANDROID", (state) => state);

  useEffect(() => {
    if (!mobileDetect.isMobile()) return;

    const resetTapCount = () => {
      tapCountRef.current = 0;
      if (tapTimerRef.current) {
        window.clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
      }
    };

    const handleTouchEnd = () => {
      tapCountRef.current += 1;

      if (tapTimerRef.current) {
        window.clearTimeout(tapTimerRef.current);
      }

      tapTimerRef.current = window.setTimeout(() => {
        tapCountRef.current = 0;
        tapTimerRef.current = null;
      }, 500);

      if (tapCountRef.current >= SECRET_TAP_MIN) {
        unlock();
        resetTapCount();
      }
    };

    document.body.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.body.removeEventListener("touchend", handleTouchEnd);
      resetTapCount();
    };
  }, [mobileDetect]);

  return (
    <div className="grid h-full lg:p-1">
      <div className="modal-content content-center justify-items-center mx-auto md:w-[80%] my-[2%] lg:my-2">
        <table className="w-auto text-base rtl:text-right text-gray-500 dark:text-gray-400 max-w-125 -my-1">
          <tbody className="">
            {
              Object.entries(displayItems).map(([key, value]) => (
                <tr className="" key={key}>
                  <th scope="row" className="px-3 py-2.5 text-sm md:text-base text-gray-300 whitespace-nowrap dark:text-gray-300 text-right align-baseline">
                    <span className="inline-block align-baseline select-none">{key}</span>
                  </th>
                  <td className="px-3 py-2.5 text-wrap whitespace-normal text-left text-sm md:text-base -indent-4 md:indent-0">
                    <div className="grid grid-cols-1">
                      {
                        value !== null && isMultiLine(value) && getLines(value).map((line, index) => (
                          <span key={index} className="inline-block align-baseline text-gray-400 dark:text-gray-400 select-none">
                            {line}
                          </span>
                        ))
                      }
                      {
                        !isMultiLine(value) && (
                          <span className="inline-block align-baseline select-none">{value}</span>
                        )
                      }
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export function PspAboutPage() {
  
  // const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [mac, setMac] = useState('00:AA:BB:00:00:99');
  const { play } = useAudio();

  const onEsc = useCallback(async () => {
    await play(AUDIO_SRC);
    router.push('/');
  }, [play, router]);

  const actions: Map<string, KeyPressAction> = useMemo(() => {
    const newActions = new Map<string, KeyPressAction>();
    newActions.set('escape', { repeat: false, onKeyPress: onEsc });
    return newActions;
  }, [onEsc]);

  useKeyboard({ actions: actions, enabledOnModal: true });

  useGamepads({
    onA: () => { void onEsc(); },
    onB: () => { void onEsc(); },
    onStart: () => { void onEsc(); },
    onSelect: () => { void onEsc(); },
  });

  // useEffect(() => {
  //   async function fetchMac() {
  //     try {
  //       const response = await fetch('/api/mac'); // Calls app/api/mac/route.ts
  //       if (!response.ok) throw new Error('Failed to fetch');

  //       const data = await response.json() as Record<string, string>;
  //       setMac(data.mac);
  //     } catch (error) {
  //       console.error('Error fetching MAC:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   void fetchMac();
  // }, []);

  return (
    <div className="absolute z-1 inset-0">
      <div className="flex flex-col place-items-center place-content-center align-middle justify-items-center h-full select-none pointer-events-none">
        <div className="grid grid-cols-2 grid-rows-3 grid-flow-row gap-4 lg:gap-10 text-[2.5vh] md:text-[3.5vh] lg:text-[5vh]">
          <div className="text-right">System Software</div>
          <div className="text-left">5.00 M33-6</div>
          <div className="text-right">Nickname</div>
          <div className="text-left">Dark_Alex</div>
          <div className="text-right">MAC Address</div>
          <div className="text-left">{mac}</div>
        </div>
      </div>
      <div className="absolute bottom-5 left-[50%] place-items-start h-10 glow-dark">
        <Link href="/">
          <div className="relative flex flex-row gap-2 h-[3.5vh] md:h-[4vh] lg:h-[5vh] text-[2.5vh] md:text-[3.5vh] lg:text-[5vh] place-items-center content-center align-middle">
            <FontAwesomeIcon icon={faCircle} className="" />
            <span className="place-self-center my-auto">Back</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function AboutPage() {

  const { currentSetting } = useSecret();

  // TODO: add all modals to the settings to be easily configured
  const isPsp = currentSetting === 'PSP';
  if (isPsp) {
    return <PspAboutPage />;
  }

  return (
    <>
      <Modal title="About">
        <div className="w-full">
          <AboutView />
        </div>
      </Modal>
    </>
  );
}

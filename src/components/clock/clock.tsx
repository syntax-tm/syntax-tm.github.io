"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Google_Sans } from "next/font/google";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSecret } from "@context/SecretContext";
import pspBatteryIcon from "public/image/psp_full_battery.png";
import Image from "next/image";
import "./clock.css";

const clockFont = Google_Sans({
  weight: ["400", "500", "600"],
  preload: true,
  subsets: ['latin'],
  adjustFontFallback: false,
});

// const clockFont = Roboto({
//   preload: true,
//   subsets: ['latin'],
// });

export default function Clock() {
  //const [time, setTime] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [hour, setHour] = useState<string | null>(null);
  const [minute, setMinute] = useState<string | null>(null);
  const [meridiem, setMeridiem] = useState<string | null>(null);
  const [showColon, setShowColon] = useState(false);

  const { isPspSecretActive, pspFontClass } = useSecret();

  const refreshTime = useCallback(() => {
    const date = new Date();
    const pad = (num: number, padWith: string = '0') => String(num).padStart(2, padWith);

    const mm = pad(date.getMonth() + 1, ' '); // Months are 0-indexed
    setMonth(mm);

    const dd = pad(date.getDate());
    setDay(dd);

    // convert to 12-hour format
    let hours = date.getHours() % 12;
    hours = hours ? hours : 12;
    const hh = pad(hours, ' ');
    setHour(hh);

    const min = pad(date.getMinutes());
    setMinute(min);

    const amPm = date.getHours() >= 12;
    setMeridiem(amPm ? 'PM' : 'AM');

    setShowColon(date.getSeconds() % 3 !== 0);

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      refreshTime();
    }

    const interval = setInterval(() => {
      refreshTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [loaded]);

  return (
    <>
      <div className={`${ !isPspSecretActive ? 'clock' : 'psp-clock' } boot-fade-in rounded-sm absolute p-2 select-none pointer-events-none tabular-nums`}>
        <div className={`clock-container ${loaded ? 'flex' : 'hidden'} ${isPspSecretActive ? pspFontClass : clockFont.className} tracking-normal align-middle flex flex-nowrap items-center ${isPspSecretActive && '-mt-1'}`}>
          <div className="flex flex-nowrap gap-0 items-center mx-2">
            <span>{month}</span>
            <span className="font-light mx-0.5 text-[14px]">/</span>
            <span>{day}</span>
          </div>
          <div className="flex flex-nowrap gap-0 items-center mx-2">
            <span>{hour}</span>
            <span className="mx-[1.5px] w-1">{showColon ? ':' : ''}</span>
            <span>{minute}</span>
          </div>
          <span>{meridiem}</span>
          {
            isPspSecretActive
              ? (
                <>
                  <div className="mx-3 object-scale-down h-8 my-auto">
                    <Image src={pspBatteryIcon} alt="psp battery" className="clock-icon" width={20} height={20} title="100%" />
                  </div>
                </>
              )
              : (
                <FontAwesomeIcon icon={faClock} className="mx-3" alignmentBaseline="middle" />
              )
          }
        </div>
      </div>
    </>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Google_Sans } from "next/font/google";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      <div className="clock boot-fade-in rounded-sm absolute top-[5%] right-0 border-white border-[1.5px] border-r-0 p-2 text-[18px] select-none pointer-events-none tabular-nums">
        <div className={`clock-container ${loaded ? 'flex' : 'hidden'} ${clockFont.className} tracking-normal align-middle flex flex-nowrap items-center`}>
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
          <FontAwesomeIcon icon={faClock} className="mx-3" />
        </div>
      </div>
    </>
  );
}

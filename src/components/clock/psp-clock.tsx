"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "@context";
import { PspBattery } from "@components/icon/icons";
import "./clock.scss";

export function PspClock() {
  const [loaded, setLoaded] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [hour, setHour] = useState<string | null>(null);
  const [minute, setMinute] = useState<string | null>(null);
  const [meridiem, setMeridiem] = useState<string | null>(null);
  const [showColon, setShowColon] = useState(false);
  const shownRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(true);
  const { font } = useTheme();

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

    if (!shownRef.current) {
      shownRef.current = setInterval(() => {
        isLoadingRef.current = false;
      }, 5000);
    }

    const interval = setInterval(() => {
      refreshTime();
    }, 1000);

    return () => {
      clearInterval(interval);
      if (shownRef.current)
        clearInterval(shownRef.current);
    };
  }, [loaded]);

  return (
    <React.Fragment>
      <div className={`text-lg xl:text-2xl ${font?.className}`}>
        <div className={`psp-clock boot-fade-in rounded-sm p-5 select-none pointer-events-none tabular-nums z-5 max-h-10 lg:max-h-14 relative`}>
          <div className={`clock-container ${loaded ? 'grid grid-flow-col' : 'hidden'} lg:text-4xl xl:text-5xl`}>
            <div className="gap-1 lg:gap-1.5 mx-5 place-content-center place-items-center justify-items-center grid grid-flow-col align-middle">
              <span className="inline-block align-middle">{month}</span>
              <span className="font-light mx-1 text-[14px] lg:text-2xl xl:text-4xl align-middle">/</span>
              <span className="inline-block align-middle">{day}</span>
            </div>
            <div className="gap-1 lg:gap-1.5 mx-2 place-content-center place-items-center justify-items-center grid grid-flow-col align-middle">
              <span className="inline-block align-middle">{hour}</span>
              <span className={`inline-block align-middle ${showColon ? 'opacity-100' : 'opacity-0'}`}>:</span>
              <span className="inline-block align-middle">{minute}</span>
              <span className="mx-5">{meridiem}</span>
              
            </div>
            <div className="grid max-h-6 lg:max-h-10 align-middle">
              <PspBattery className="clock-icon align-middle" aria-label="100%" />
            </div>
            
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { PspClock as default };

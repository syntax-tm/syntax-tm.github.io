"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./clock.scss";
import { useTheme } from "@context";

export default function Clock() {
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
        <div className={`clock boot-fade-in rounded-sm absolute p-2 select-none pointer-events-none tabular-nums z-5`}>
          <div className={`clock-container ${loaded ? 'flex' : 'hidden'} tracking-normal align-middle flex flex-nowrap items-center`}>
            <div className="flex flex-nowrap gap-0 items-center mx-2">
              <span>{month}</span>
              <span className="font-light mx-1 text-[14px]">/</span>
              <span>{day}</span>
            </div>
            <div className="flex flex-nowrap gap-0 items-center mx-2">
              <span>{hour}</span>
              <span className="w-3 text-center">{showColon ? ':' : ''}</span>
              <span>{minute}</span>
            </div>
            <span>{meridiem}</span>
            <FontAwesomeIcon icon={faClock} className="mx-3" alignmentBaseline="middle" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

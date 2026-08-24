"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import localFont from "next/font/local";

const clockDigitFont = localFont({
  src: './fonts/Digital-7Mono.woff2',
  preload: true,
  weight: '400',
  variable: '--font-digital-7-mono',
});

const defaultFont = localFont({
  src: [
    {
      path: './fonts/Bauhaus-Regular.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: './fonts/Bauhaus-Bold.woff2',
      style: 'normal',
      weight: '700',
    },
  ],
  preload: true,
  variable: '--font-bauhaus',
});

const calendarFont = localFont({
  src: './fonts/RodinNTLGPro-DB-AlphaNum.woff2',
  preload: true,
  weight: '400',
  variable: '--font-rodin-ntlg-pro',
});

export function WiiClock() {
  const [loaded, setLoaded] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [hour, setHour] = useState<string | null>(null);
  const [minute, setMinute] = useState<string | null>(null);
  const [meridiem, setMeridiem] = useState<string | null>(null);
  const [showColon, setShowColon] = useState(false);

  const refreshDate = useCallback(() => {

    const now = new Date();
    const days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday: string = days[now.getDay()];
    const month: number = now.getMonth() + 1; // months are 0-indexed
    const day: number = now.getDate();

    //console.log(`${weekday} ${month}/${day}`);

    setDayOfWeek(weekday);
    setMonth(month.toString().padStart(2));
    setDay(day.toString().padStart(2));

  }, []);

  const refreshTime = useCallback(() => {
    const date = new Date();
    const pad = (num: number, padWith: string = '0') => String(num).padStart(2, padWith);

    const mm = pad(date.getMonth() + 1, ' '); // months are 0-indexed
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
      refreshDate();
    }

    const interval = setInterval(() => {
      refreshTime();
    }, 1000);

    const dateInterval = setInterval(() => {
      refreshDate();
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(dateInterval);
    };
  }, [loaded]);

  return (
    <React.Fragment>
      <div className={`wii-clock boot-fade-in ${clockDigitFont?.className} h-full w-full relative grid select-none pointer-events-none`}>
        <div className="w-full h-full bottom-0 left-0 grid grid-rows-2 absolute">
          <div className={`wii-clock-container flex text-[clamp(5rem,6vw,10rem)]`}>
            <span className="w-30 text-right flex-10">{hour}</span>
            <span className={`${ showColon || 'opacity-0' } flex-none`}>:</span>
            <div className="w-30 text-left flex-10 relative">
              <span>{minute}</span>
              <span className={`wii-clock-meridiem text-base xl:text-3xl ${defaultFont.className} font-bold align-text-middle ml-10 absolute left-1/3 bottom-1/7`}>{meridiem}</span>
            </div>
          </div>
          <div className={`wii-calendar-container align-middle my-auto grid text-[clamp(1rem,4.5vw,12rem)] ${calendarFont.className} text-center`}>
            <div className="flex align-middle justify-center">
              <div className="mr-15">{dayOfWeek}</div>
              <div className="inline-flex">
                <div>{month}</div>
                <div>/</div>
                <div>{day}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { WiiClock as default };

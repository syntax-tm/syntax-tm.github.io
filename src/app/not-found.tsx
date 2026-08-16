"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BackgroundView } from "@components/background/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { ClockView } from "@components/clock/clock-view";
import { useSettingStore } from "@stores/setting-store";
import sh404 from "public/image/404.png";
import "@styles/global.scss";
import "./not-found.scss";

export default function NotFound() {

  const { unlock } = useSettingStore('_404', (state) => state);

  useEffect(() => {

    unlock();

  }, []);

  return (
    <div className="root-container not-found">
      <BackgroundView />
      <ClockView />
      <div className="grid content-center z-0 overflow-hidden absolute left-0 top-0 w-full h-screen text-white">
        <Link href="/" aria-label="Return to the home page">
          <div className="flex flex-row justify-center items-center text-9xl hover:animate-pulse">
            <FontAwesomeIcon icon={faBug} className="object-contain justify-self-center w-full h-full" />
            <span className="text-center">
              404
            </span>
          </div>
          <hr className="w-[80%] md:w-[60%] mx-auto my-5 md:my-20 border-gray-500 opacity-50" />
          <div className="flex flex-row justify-center items-center text-2xl">
            <Image src={sh404} alt="404" className="mx-auto max-w-[80%] md:max-w-[40%] opacity-50 hover:opacity-100 hover:animate-pulse" loading="eager" />
          </div>
        </Link>
      </div>
    </div>
  );
}

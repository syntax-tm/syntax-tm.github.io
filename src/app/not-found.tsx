"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AchievementId } from "@enums";
import BackgroundView from "@components/background/background-view";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { useSecret } from "@context/SecretContext";
import sh404 from "public/image/404.png";
import Clock from "@components/clock/clock";
import "./not-found.css";
import "@styles/global.scss";

export default function NotFound() {

  const { unlockSecret } = useSecret();

  useEffect(() => {

    unlockSecret(AchievementId._404);

  }, []);

  return (
    <div className="root-container">
      <BackgroundView />
      <Clock />
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

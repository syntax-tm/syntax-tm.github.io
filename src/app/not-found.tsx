"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Background from "@components/background/background";
import Secret from "@components/secret/Secret";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBug,
} from "@fortawesome/free-solid-svg-icons";
import sh404 from "public/image/404.png";
import "./globals.css";
import "./404.css";

const Clock = dynamic(() => import('@components/clock/Clock'), { ssr: false });

export default function NotFound() {
  return (
    <div className="root-container">
      <Background />
      <Secret />
      <Clock />
      <div className="grid content-center z-100 overflow-hidden absolute left-0 top-0 w-full h-screen text-white">
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

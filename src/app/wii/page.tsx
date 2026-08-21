"use client";

import React from "react";
import { useBoot } from '@context/BootContext';
import { useTheme } from "@context/ThemeContext";
import { Menu } from "@components/xmb-menu/xmb-menu";
import { BackgroundView } from "@components/background/background-view";
import { BootView } from "@components/boot/";
import WiiMenuWrapper from "@components/wii-menu/wii-menu";
import WiiBoot from "@components/wii-menu/wii-boot";

export default function Wii() {

  const { isBootVisible } = useBoot();

  return isBootVisible
    ? <WiiBoot />
    : <WiiMenuWrapper />;

}
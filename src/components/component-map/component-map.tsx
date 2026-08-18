import React from "react";
import BackgroundView from "@components/background/background-view";
import BrixBackground from "@components/background/brix-background";
import PspBackground from "@components/background/psp-background";
import DreamcastBackground from "@components/background/dreamcast-background";
import PS2Background from "@components/background/ps2-background";
import SecretBackground from "@components/background/secret-background";
import WebGlBackground from "@components/background/webgl-background";
import Boot from "@components/boot/boot";
import BrixBoot from "@components/boot/brix-boot";
import DreamcastBoot from "@components/boot/dreamcast-boot";
import BootView from "@components/boot/boot-view";
import Ps1Boot from "@components/boot/ps1-boot";
import Ps2Boot from "@components/boot/ps2-boot";
import PspBoot from "@components/boot/psp-boot";
import ClockView from "@components/clock/clock-view";
import Clock from "@components/clock/clock";
import Ps2Clock from "@components/clock/ps2-clock";
import PspClock from "@components/clock/psp-clock";
import DreamcastClock from "@components/clock/dreamcast-clock";
import LoadingView from "@components/loading/loading";

const componentMap = new Map<string, React.ReactNode>([
  ['background-view', <BackgroundView />],
  ['brix-background', <BrixBackground />],
  ['psp-background', <PspBackground />],
  ['dreamcast-background', <DreamcastBackground />],
  ['ps2-background', <PS2Background />],
  ['secret-background', <SecretBackground />],
  ['webgl-background', <WebGlBackground />],
  ['boot', <Boot />],
  ['brix-boot', <BrixBoot />],
  ['dreamcast-boot', <DreamcastBoot />],
  ['boot-view', <BootView />],
  ['ps1-boot', <Ps1Boot />],
  ['ps2-boot', <Ps2Boot />],
  ['psp-boot', <PspBoot />],
  ['clock-view', <ClockView />],
  ['clock', <Clock />],
  ['ps2-clock', <Ps2Clock />],
  ['psp-clock', <PspClock />],
  ['dreamcast-clock', <DreamcastClock />],
  ['loading', <LoadingView />],
]);

export { componentMap as default };

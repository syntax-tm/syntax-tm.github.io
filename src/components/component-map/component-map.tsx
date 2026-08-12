import React from "react";
import BackgroundView from "@components/background/background-view";
import PspBackground from "@components/background/psp-background";
import DreamcastBackground from "@components/background/dreamcast-background";
import PS2Background from "@components/background/ps2-background";
import SecretBackground from "@components/background/secret-background";
import WebGlBackground from "@components/background/webgl-background";
import Boot from "@components/boot/boot";
import DreamcastBoot from "@components/boot/dreamcast-boot";
import Ps1Boot from "@components/boot/ps1-boot";
import Ps2Boot from "@components/boot/ps2-boot";
import ClockView from "@components/clock/clock-view";
import Clock from "@components/clock/clock";
import PspClock from "@components/clock/psp-clock";
import DreamcastClock from "@components/clock/dreamcast-clock";
import LoadingView from "@components/loading/loading";

const componentMap = new Map<string, React.ReactNode>([
  ['background-view', <BackgroundView />],
  ['psp-background', <PspBackground />],
  ['dreamcast-background', <DreamcastBackground />],
  ['ps2-background', <PS2Background />],
  ['secret-background', <SecretBackground />],
  ['webgl-background', <WebGlBackground />],
  ['boot', <Boot />],
  ['dreamcast-boot', <DreamcastBoot />],
  ['ps1-boot', <Ps1Boot />],
  ['ps2-boot', <Ps2Boot />],
  ['clock-view', <ClockView />],
  ['clock', <Clock />],
  ['psp-clock', <PspClock />],
  ['dreamcast-clock', <DreamcastClock />],
  ['loading', <LoadingView />],
]);

export default componentMap;

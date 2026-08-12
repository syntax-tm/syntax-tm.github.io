import { useAudio, useBoot, useTheme } from "@context";
import React, { useEffect, useRef, useState } from "react";
import Ps1LogoImage from "image/ps1.png";
import Image from "next/image";
import "./ps1-boot.scss";

export default function Ps1Boot() {

  const PS1_BOOT_AUDIO_SRC = 'audio/ps1/boot.mp3';

  const { isBootVisible } = useBoot();
  const { boot } = useTheme();
  const { play } = useAudio();

  useEffect(() => {
    void play(PS1_BOOT_AUDIO_SRC);
  }, []);

  return isBootVisible && (
    <>
      <div className="ps1-boot">
        <div className="slide slide-1">
          <div className="screen screen-1">
            <div className="title">SONY</div>
            <div>
              <div className="logo"></div>
            </div>

            <div className="subtitle">
              COMPUTER <br/>
              <span>ENTERTAINMENT</span>
            </div>
          </div>
        </div>

        <div className="slide slide-2">
          <div className="screen screen-2">
            <div className="logo">
              <Image width="220" src={Ps1LogoImage} alt="" loading="eager" />
            </div>

            <div className="title">
              PlayStation<span>tm</span>
            </div>

            <div className="subtitle">
              Licensed by <br/>
              Sony Computer Entertainment America <br/> <br/>

              SCEA<span>tm</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

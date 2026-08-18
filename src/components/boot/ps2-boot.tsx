import { useAudio, useBoot } from "@context";
import React, { useEffect } from "react";
import "./ps2-boot.scss";

const PS2_BOOT_AUDIO_SRC = 'audio/ps2/bootup.mp3';
const PS2_BOOT_LOGO_AUDIO_SRC = 'audio/ps2/open.mp3';

export function Ps2Boot() {

  const { isBootVisible } = useBoot();
  const { play } = useAudio();

  useEffect(() => {
    if (!isBootVisible) return;
    void play(PS2_BOOT_AUDIO_SRC);

    const playOpenAudioTimer = window.setTimeout(() => {
      if (!isBootVisible) return;
      void play(PS2_BOOT_LOGO_AUDIO_SRC);
    }, 10500);

    return () => {
      window.clearTimeout(playOpenAudioTimer);
    };

  }, [isBootVisible]);

  const boxCount = 112;
  const boxes = [...Array(boxCount).keys()];

  return (
    <>
      <div className="ps2-boot flex h-screen w-screen align-center items-center justify-center">
        <div className="ps2-boot-screen">
          <div className="ps2-boot-content">
            <p className="ps2-boot-copyright">
              Sony computer entertainment
            </p>
            <p className="ps2-boot-branding" >
              Playstation
              <span className="ps2-boot-is-small">®</span>&nbsp;2
            </p>
          </div>
          <div className="ps2-boot-bg" />
          <div className="ps2-boot-inner">
            <div className="ps2-boot-inner-bg" />
            <div className="ps2-boot-particles">
              <span />
              <span />
              <span />
            </div>
            {
              boxes.map((b) => {
                return (
                  <React.Fragment key={b}>
                    <div className="ps2-boot-box-container">
                      <div className="ps2-boot-box">
                        <div className="ps2-boot-top" />
                        <div className="ps2-boot-bottom" />
                        <div className="ps2-boot-left" />
                        <div className="ps2-boot-right" />
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            }
          </div>
        </div>
      </div>
    </>
  );
}

export { Ps2Boot as default };

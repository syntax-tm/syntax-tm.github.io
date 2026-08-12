import { useAudio } from "@context";
import React, { useEffect } from "react";
import "./ps2-boot.scss";

export default function Ps2Boot() {

  const PS2_BOOT_AUDIO_SRC = 'audio/ps2/boot.mp3';

  const { play } = useAudio();

  useEffect(() => {
    void play(PS2_BOOT_AUDIO_SRC);
  }, []);

  const boxCount = 112;
  const boxes = [...Array(boxCount).keys()];

  return (
    <>
      <div className="boot-container absolute left-0 top-0 w-full h-full grid bg-black">
        <div className="ps2-boot grid align-middle">
          <div className="ps2-boot-screen my-auto">
            <div className="ps2-boot-content">
              <p className="ps2-boot-copyright">
                Sony computer entertainment
              </p>
              <p className="ps2-boot-branding">
                Playstation
                <span className="ps2-boot-is-small">®</span>&nbsp;2
              </p>
            </div>
            <div className="ps2-boot-inner">
              <div className="ps2-boot-inner-bg" />
              <div className="ps2-boot-particles">
                <span className="" />
                <span className="" />
                <span className="" />
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
      </div>
    </>
  );
}
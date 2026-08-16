import React, { CSSProperties, useMemo } from "react";
import { useBoot } from "@context";
import "./dreamcast-background.scss";

export function DreamcastBackground({ style }: { style?: CSSProperties }) {

  const { isBootVisible, isBootTransitioningOut } = useBoot();

  const isBoot = useMemo(() => {
    return isBootVisible || isBootTransitioningOut;
  }, [isBootVisible, isBootTransitioningOut]);

  return (
    <>
      <div className="dreamcast-background grid grid-cols-1 h-full w-full absolute left-0 top-0" style={style}>
        {
          !isBoot && (
            <div className="h-[10%] bg-white border border-red-500 grid absolute top-0 left-0 w-full -z-10 transition-opacity">
            </div>
          )
        }
        {/* <div className={`background secret-background dreamcast-bg absolute top-0 left-0 w-full h-full -z-100 pointer-events-none overflow-hidden`}></div> */}
        <div className="dreamcast-background absolute left-0 top-0 h-[90%] -z-100">
          <div className="atmosphere"></div>
          <div className="swirl swirl-1"></div>
          <div className="swirl swirl-2"></div>
          <div className="center-glow"></div>
        </div>
      </div>
    </>
  );
}

export { DreamcastBackground as default };

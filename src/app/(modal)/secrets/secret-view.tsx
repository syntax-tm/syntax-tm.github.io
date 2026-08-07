"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSecret } from "@context/SecretContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCheck, faCheckCircle, faMinus } from "@fortawesome/free-solid-svg-icons";
import { AchievementId } from "@enums";
import { StatDefinition } from "types";
import "./secrets.css";

export interface SecretViewProps
{
  id: AchievementId;
  unlockMinimum: number;
  stat: StatDefinition;
}

export default function SecretView({ id, stat, unlockMinimum }: SecretViewProps) {

  const { settings, toggle, getSetting, lock, unlock } = useSecret();
  const unlockCountRef = useRef(0);
  const unlockTimerRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLTableCellElement | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const setting = getSetting(id);
  setIsUnlocked(setting.isUnlocked);
  setIsEnabled(setting.isEnabled);

  const toggleEnabled = useCallback(() => {
    if (!settings) return;
    toggle(id);
  }, [settings]);

  useEffect(() => {

    if (!elementRef.current) return;

    const resetTapCount = () => {
      unlockCountRef.current = 0;
      if (unlockTimerRef.current) {
        window.clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }
    };

    const handleTouchEnd = () => {
      unlockCountRef.current += 1;

      if (unlockTimerRef.current) {
        window.clearTimeout(unlockTimerRef.current);
      }

      unlockTimerRef.current = window.setTimeout(() => {
        unlockCountRef.current = 0;
        unlockTimerRef.current = null;
      }, 500);

      if (unlockCountRef.current >= unlockMinimum) {
        resetTapCount();
        if (isUnlocked) {
          lock(id);
        }
        else {
          unlock(id);
        }
      }
    };

    elementRef.current.addEventListener("touchend", handleTouchEnd);
    elementRef.current.addEventListener("click", handleTouchEnd);

    return () => {
      elementRef.current?.removeEventListener("touchend", handleTouchEnd);
      elementRef.current?.removeEventListener("click", handleTouchEnd);
      resetTapCount();
    };
  }, [isUnlocked]);

  return (
    <React.Fragment key={id}>
      <tr>
        <td className={`border-b border-t border-gray-400/25 text-center ${isUnlocked ? 'bg-green-300/50' : 'bg-gray-600/40'} pointer-events-none select-none justify-center items-center`}>
          <FontAwesomeIcon icon={isUnlocked ? faCheckCircle : faLock}
            className={`py-1 w-full h-full mx-3`} />
        </td>
        <td className={`border border-gray-300/25 bg-gray-600/40 text-ellipsis text-nowrap text-xs md:text-lg px-2 ${!isUnlocked && 'text-gray-400'}`}
          ref={elementRef}>
          <span className="pointer-events-none select-none">
            {isUnlocked ? stat.title : 'Hidden'}
          </span>
        </td>
        <td className={`border border-gray-300/25 bg-gray-600/40 text-wrap text-xs md:text-lg px-2 ${!isUnlocked && 'text-gray-400'} pointer-events-none select-none`}>
          {isUnlocked ? stat.description : 'Hidden'}
        </td>
        <td className={`border border-gray-300/25 ${isEnabled ? 'bg-green-300/50' : 'bg-gray-600/40'}`}>
          <div className={`grid items-center w-full h-full cursor-pointer`} onClick={toggleEnabled}>
            {
              isUnlocked && (
                isEnabled
                  ? <FontAwesomeIcon icon={faCheck} className="mx-auto py-1" />
                  : <FontAwesomeIcon icon={faMinus} className="mx-auto py-1" />
              )
            }
          </div>
        </td>
      </tr>
    </React.Fragment>
  );

};

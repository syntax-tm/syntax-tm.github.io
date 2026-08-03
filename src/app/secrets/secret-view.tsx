"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSecret, PlayerStat, AchievementId } from "@context/SecretContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faLock, faUnlock, faUnlockAlt, faCheck, faCheckCircle, faToggleOff, faToggleOn, IconDefinition, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./secrets.css";

export interface SecretViewProps
{
  id: AchievementId;
  stat: PlayerStat;
  unlockMinimum: number;
}

export default function SecretView({ id, stat, unlockMinimum }: SecretViewProps) {

  const { secrets, setSecretEnabled, isSecretUnlocked, isSecretEnabled, lockSecret, unlockSecret, stats } = useSecret();
  const unlockCountRef = useRef(0);
  const unlockTimerRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLTableCellElement | null>(null);
  const secret = secrets[id];
  const [unlocked, setUnlocked] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const toggleEnabled = useCallback(() => {
    const newState = !enabled;
    setSecretEnabled(id, newState, true);
  }, [enabled, stats]);

  useEffect(() => {
    setUnlocked(isSecretUnlocked(id));
    setEnabled(isSecretEnabled(id));
  }, [stats]);

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
        if (unlocked) {
          lockSecret(id);
        }
        else {
          unlockSecret(id);
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
  }, [unlocked]);

  return (
    <React.Fragment key={id}>
      <tr>
        <td className={`border-b border-t border-gray-400/25 text-center ${unlocked ? 'bg-green-300/50' : 'bg-gray-600/40'} pointer-events-none select-none justify-center items-center`}>
          <FontAwesomeIcon icon={unlocked ? faCheckCircle : faLock}
            className={`py-1 w-full h-full mx-3`} />
        </td>
        <td className={`border border-gray-300/25 bg-gray-600/40 text-ellipsis text-nowrap text-xs md:text-lg px-2 ${!unlocked && 'text-gray-400'}`}
          ref={elementRef}>
          <span className="pointer-events-none select-none">
            {unlocked ? secret.title : 'Hidden'}
          </span>
        </td>
        <td className={`border border-gray-300/25 bg-gray-600/40 text-wrap text-xs md:text-lg px-2 ${!unlocked && 'text-gray-400'} pointer-events-none select-none`}>
          {unlocked ? secret.description : 'Hidden'}
        </td>
        <td className={`border border-gray-300/25 ${enabled ? 'bg-green-300/50' : 'bg-gray-600/40'}`}>
          <div className={`grid items-center w-full h-full cursor-pointer`} onClick={toggleEnabled}>
            {
              unlocked && (
                enabled
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

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
  const [unlocked, setUnlocked] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const unlockCountRef = useRef(0);
  const unlockTimerRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLTableCellElement | null>(null);

  const secret = secrets[id];

  const toggleEnabled = useCallback(() => {
    const newState = !enabled;
    setSecretEnabled(id, newState);
    setEnabled(newState);
  }, [enabled]);

  useEffect(() => {

    const isUnlocked = isSecretUnlocked(id);
    setUnlocked(isUnlocked);

    const isEnabled = isSecretEnabled(id);
    setEnabled(isEnabled);

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
        <td className={`border-b border-t border-gray-400/25 text-center ${unlocked ? 'bg-green-300/50' : ''} pointer-events-none select-none justify-center items-center`}>
          <FontAwesomeIcon icon={stat.isUnlocked ? faUnlockAlt : faLock}
            className={`py-3 w-full h-full mx-3`} />
        </td>
        <td className={`border border-gray-300/25 text-ellipsis text-nowrap text-xs md:text-lg px-2 ${!unlocked && 'text-gray-400'}`}
          ref={elementRef}>
          <span className="pointer-events-none select-none">
            {unlocked ? secret.title : 'Hidden'}
          </span>
        </td>
        <td className={`border border-gray-300/25 text-wrap text-xs md:text-lg px-2 ${!unlocked && 'text-gray-400'} pointer-events-none select-none`}>
          {unlocked ? secret.description : 'Hidden'}
        </td>
        <td className={`border border-gray-300/25 ${enabled && 'bg-green-300/50'}`}>
          <div className={`grid items-center w-full h-full cursor-pointer`} onClick={toggleEnabled}>
            {
              unlocked && (
                enabled
                  ? <FontAwesomeIcon icon={faCheck} className="mx-auto my-0.5" />
                  : <FontAwesomeIcon icon={faMinus} className="mx-auto my-0.5" />
              )
            }
          </div>
        </td>
      </tr>
    </React.Fragment>
  );

};

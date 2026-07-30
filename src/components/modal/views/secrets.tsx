"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSecret, StatDefinition, PlayerStat, AchievementId } from "@context/SecretContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faLock, faUnlock, faUnlockAlt, faCheck, faCheckCircle, faToggleOff, faToggleOn, IconDefinition, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./secrets.css";

export interface SecretsViewProps
{
  title: string;
  description?: string;
}

export interface SecretViewProps
{
  id: AchievementId,
  stat: PlayerStat;
}

const SECRET_TAP_MIN = 5;

const SecretView = ({ id, stat }: SecretViewProps) => {

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

      if (unlockCountRef.current >= SECRET_TAP_MIN) {
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
    <>
      <tr key={id} className="">
        <td className={`border-b border-gray-400/25 text-center ${unlocked ? 'bg-green-300/50' : 'bg-gray-700'} pointer-events-none select-none`}>
          <FontAwesomeIcon icon={stat.isUnlocked ? faUnlockAlt : faLock}
            className={`py-3 w-full h-full mx-auto`} size="xl" />
        </td>
        <td className={`border border-gray-300/25 text-ellipsis text-nowrap text-xs md:text-lg px-2 ${!unlocked && 'text-gray-400'}`}
          ref={elementRef}>
          {unlocked ? secret.title : 'Hidden'}
        </td>
        <td className={`border border-gray-300/25 text-ellipsis text-nowrap text-xs md:text-lg px-2 ${!unlocked && 'text-gray-400'} pointer-events-none select-none`}>
          {unlocked ? secret.description : 'Hidden'}
        </td>
        <td className={`border border-gray-300/25 ${enabled && 'bg-green-300/50'}`}>
          <div className={`grid items-center w-full h-full cursor-pointer`} onClick={toggleEnabled}>
            {
              unlocked && (
                // <input type="checkbox" checked={enabled} readOnly className="m-0 w-full h-full mx-auto" />
                enabled
                  ? <FontAwesomeIcon icon={faCheck} className="mx-auto my-0.5" />
                  : <FontAwesomeIcon icon={faMinus} className="mx-auto my-0.5" />
              )
            }
          </div>
          {/* <button onClick={toggleEnabled} className={`${enabled ? 'bg-green-300' : 'bg-gray-500'} w-full h-full text-white`}>
            {icon && <FontAwesomeIcon icon={icon} />}
          </button> */}
        </td>
      </tr>
    </>
  );

};

export const SecretsView = ({ title, description }: SecretsViewProps) => {

  const { stats } = useSecret();

  return (
    <>
      <div className="w-full h-full text-white my-auto">
        <table className="table-auto border-collapse mx-auto w-full my-auto">
          <thead className="">
            <tr className="content-center">
              <th className=" bg-gray-800 text-sm md:text-md border border-gray-400/25">
                <FontAwesomeIcon icon={faQuestionCircle} className="m-2 p-1 w-full h-full mx-auto my-auto" size="xl"
                  aria-label="Status" />
              </th>
              <th className="p-2 bg-gray-800 text-sm border border-gray-400/25">Name</th>
              <th className="p-2 bg-gray-800 text-sm border border-gray-400/25">Description</th>
              <th className="p-2 bg-gray-800 text-sm border border-gray-400/25">Enabled</th>
            </tr>
          </thead>
          <tbody className="bg-gray-600/40">
            {
              stats && Array.from(stats).map(([id, stat]) => {
                return (
                  <SecretView key={id} id={id} stat={stat} />
                );
              })
            }
          </tbody>
        </table>
      </div>
    </>
  );
};
"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCheck, faCheckCircle, faMinus } from "@fortawesome/free-solid-svg-icons";
import { AchievementId } from "@enums";
import { SnackbarVariant, StatDefinition } from "types";
// import { useSettingsStore } from "@providers/settings-store-provider";
import { useSnackbar } from "@context";
import { useSettingStore } from "@stores/setting-store";
import "./secrets.css";

const CANCEL_AUDIO_SRC = '/audio/cancel.mp3';
const TROPHY_AUDIO_SRC = '/audio/trophy.mp3';
const TOGGLE_AUDIO_SRC = '/audio/confirm.mp3';

export interface SecretViewProps
{
  id: AchievementId;
  unlockMinimum: number;
  stat: StatDefinition;
}

export default function SecretView({ id, stat, unlockMinimum }: SecretViewProps) {

  const { isUnlocked, isEnabled, lock, unlock, toggle } = useSettingStore(id, (state) => state);
  const unlockCountRef = useRef(0);
  const unlockTimerRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLTableRowElement | null>(null);
  const { showSnackbar } = useSnackbar();

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

        let title, description;
        const variant: SnackbarVariant = isUnlocked ? 'lock' : 'unlock';
        const audioSrc = isUnlocked ? CANCEL_AUDIO_SRC : TROPHY_AUDIO_SRC;

        if (isUnlocked) {
          lock();
          title = 'Secret Locked';
          description = `'${stat.title}' is now locked.`;
        }
        else {
          unlock();
          title = stat.title;
          description = stat.description;
        }

        showSnackbar(title, description, variant, audioSrc);
      }
    };

    elementRef.current.addEventListener("touchend", handleTouchEnd);
    elementRef.current.addEventListener("click", handleTouchEnd);

    return () => {
      elementRef.current?.removeEventListener("touchend", handleTouchEnd);
      elementRef.current?.removeEventListener("click", handleTouchEnd);
      resetTapCount();
    };
  }, [isUnlocked, lock, unlock]);

  const onToggle = useCallback(() => {
    const newState = !isEnabled;

    toggle();

    const event = new CustomEvent("themeChange", {
      detail: {
        id: newState ? id : null,
      },
    });
    window.dispatchEvent(event);

    const action = newState ? 'Enabled' : 'Disabled';
    const variant: SnackbarVariant = newState ? 'enable' : 'disable';

    showSnackbar(`Secret ${action}`, `'${id}' is now ${newState ? 'enabled' : 'disabled'}.`, variant, TOGGLE_AUDIO_SRC);
  }, [isEnabled, toggle]);

  return (
    <React.Fragment key={id}>
      <tr ref={elementRef}>
        <td className={`border-b border-t border-gray-400/25 text-center ${isUnlocked ? 'bg-green-300/50' : 'bg-gray-600/40'} select-none justify-center items-center`}>
          <FontAwesomeIcon icon={isUnlocked ? faCheckCircle : faLock}
            className={`py-1 w-full h-full mx-3`} />
        </td>
        <td className={`border border-gray-300/25 bg-gray-600/40 text-ellipsis text-nowrap text-xs md:text-lg px-2 ${!isUnlocked && 'text-gray-400'}`}>
          <span className="pointer-events-none select-none">
            {isUnlocked ? stat.title : 'Hidden'}
          </span>
        </td>
        <td className={`border border-gray-300/25 bg-gray-600/40 text-wrap text-xs md:text-lg px-2 ${!isUnlocked && 'text-gray-400'} select-none`}>
          {isUnlocked ? stat.description : 'Hidden'}
        </td>
        <td className={`border border-gray-300/25 ${isUnlocked && isEnabled ? 'bg-green-300/50' : 'bg-gray-600/40'}`}>
          <div className={`grid items-center w-full h-full cursor-pointer`} onClick={onToggle}>
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

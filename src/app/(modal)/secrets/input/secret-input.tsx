"use client";

import React, { ChangeEvent, useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { SECRET_INPUT_FONT } from "types/font";
import { useRouter } from "next/navigation";
import { SnackbarVariant, StatDefinition } from "types";
import { useSnackbar } from "@context";
import stats from "@config/settings";
import { useSettingStores } from "@stores";

const CANCEL_AUDIO_SRC = '/audio/cancel.mp3';
const TROPHY_AUDIO_SRC = '/audio/trophy.mp3';

export default function SecretInput() {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [passwords] = useState<Record<string, StatDefinition>>({ });
  const [isValid, setIsValid] = useState(false);
  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { stores } = useSettingStores();
  const router = useRouter();

  const getSecret = useCallback((password: string) => {
    const searchTerm = password.toLowerCase().trim();

    if (searchTerm in passwords) {
      const secret = passwords[searchTerm];
      return secret;
    }

    return null;
  }, [passwords]);

  useEffect(() => {

    stats.forEach(s => {
      if (!s.password) return;
      passwords[s.password] = s;
    });

  }, [stats]);

  useEffect(() => {

    if (!text) {
      setIsValid(false);
      return;
    }

    const searchTerm = text.toLowerCase().trim();
    const secret = getSecret(searchTerm);

    if (!secret) {
      return;
    }

    const store = stores?.get(secret.id);

    if (!store) {
      throw new Error(`BUG. A SettingStore for '${secret.id}' was not registered.`);
    }

    store.getState().unlock();

    const title = secret.title;
    const description = secret.description;
    const variant: SnackbarVariant = 'unlock';

    showSnackbar(title, description, variant, TROPHY_AUDIO_SRC);

    setIsValid(true);
    setIsEnabled(false);
    setIsLoading(true);

    router.push('/');

  }, [text]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <form className="grid h-full w-full">
        <div className="grid my-auto mx-auto">
          <div className="flex border-gray-200 border-b">
            <div className="grid relative justify-center place-content-center items-center">
              <input id="text" name="text" type="text" autoComplete="off"
                required placeholder="Password..."
                className={`p-2 text-center text-xl lg:text-3xl xl:text-5xl select-all bg-gray-400/50 hover:bg-blue-400/30 hover:focus:bg-blue-400/60 ${SECRET_INPUT_FONT.className} rounded rounded-r-none`}
                value={text} minLength={3} maxLength={15}
                ref={inputRef} autoFocus
                onChange={(e) => {
                  setText(e.target.value);
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }} />
            </div>
            {/* <button type="submit"
              className="p-2 text-xl bg-blue-500 rounded rounded-l-none hover:bg-blue-300 hover:text-zinc-900 hover:animate-pulse disabled:bg-zinc-700 disabled:border-zinc-700 disabled:text-zinc-900 disabled:cursor-not-allowed">
              <div className="flex gap-3 px-4">
                { icon && <FontAwesomeIcon icon={icon} className={`my-auto `} /> }
                <div className="my-auto">Submit</div>
              </div>
            </button> */}
          </div>
        </div>
      </form>
    </>
  );
}

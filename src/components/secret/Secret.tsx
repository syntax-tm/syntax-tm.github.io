"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { useGamepads } from 'awesome-react-gamepads';
import { useKeySequence } from "@hooks/useKeySequence";
import { useAudio } from '@context/AudioContext';
import { useSnackbar } from "@context/SnackbarContext";
import './secret.css';

const SECRET_AUDIO_SRC = '/audio/startup.mp3';
const KONAMI_CODE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

export default function Secret() {
  const [secret, setSecret] = useState(false);
  const { play } = useAudio();
  const { showSnackbar } = useSnackbar();

  const toggleSecret = async () => {
    const isActive = !secret;
    setSecret(isActive);
    await play(SECRET_AUDIO_SRC);
    const message = isActive ? 'activated' : 'deactivated';
    showSnackbar(`Secret ${message}.`, 'success');
  };

  useEffect(() => {
    const handleSecretActivate = () => {
      void toggleSecret();
    };

    window.addEventListener("secret:activate", handleSecretActivate);

    return () => {
      window.removeEventListener("secret:activate", handleSecretActivate);
    };
  }, [secret]);

  useKeySequence(KONAMI_CODE, () => {
    toggleSecret();
  });

  useGamepads({
    onKonamiSuccess: () => {
      toggleSecret();
    },
  });

  return (
    <>
      <div className={secret ? 'secret absolute top-0 left-0 overflow-hidden h-dvh -z-40' : ''}>
        <div className='wave' />
        <div className='wave' />
        <div className='wave' />
      </div>
    </>
  );
}
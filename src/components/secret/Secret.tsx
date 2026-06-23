"use client";

import React from "react";
import { useState } from "react";
import { useGamepads } from 'awesome-react-gamepads';
import { useAudio } from '@context/AudioContext';
import { useSnackbar } from "@context/SnackbarContext";

const SECRET_AUDIO_SRC = '/audio/startup.mp3';

export default function Secret() {
  const [secret, setSecret] = useState(false);
  const { play } = useAudio();
  const { showSnackbar } = useSnackbar();

  useGamepads({
    onKonamiSuccess: () => {
      setSecret(true);
      play(SECRET_AUDIO_SRC);
      showSnackbar('Secret activated.', 'success')
    },
  });

  return (
    <>
      <div className={secret ? 'secret' : ''}></div>
    </>
  );
}
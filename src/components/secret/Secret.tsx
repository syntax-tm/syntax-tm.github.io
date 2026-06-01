"use client";

import React from "react";
import { useState } from "react";
import { useGamepads } from 'awesome-react-gamepads';

export default function Secret() {
  const [secret, setSecret] = useState(false);

  useGamepads({
    onKonamiSuccess: () => {
      setSecret(true);
    }
  });

  return (
    <>
      <div className={secret ? 'secret' : ''}></div>
    </>
  )
}
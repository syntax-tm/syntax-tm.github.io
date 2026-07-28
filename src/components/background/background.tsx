"use client";

import React from 'react';
import { useSecret } from '@context/SecretContext';
import './background.css';

export default function Background() {

  const { isKonamiSecretActive, isPspSecretActive } = useSecret();

  return (
    <>
      {isPspSecretActive && (
        <>
          <object
            type="image/svg+xml"
            data="/psp.svg"
            className="w-full h-full -z-50 absolute top-0 left-0 overflow-hidden"
          ></object>
        </>
      )}
      {!isPspSecretActive && (
        <>
          <div className={`background ${isKonamiSecretActive && 'secret'} absolute top-0 left-0 overflow-hidden h-dvh -z-50`}>
            <div className='wave' />
            <div className='wave' />
            <div className='wave' />
          </div>
        </>
      )}
    </>
  );
};

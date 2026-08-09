"use client";

import React from 'react';
import './psp-background.scss';

export default function PspBackground() {

  return (
    <div className={`background psp-background absolute top-0 left-0 overflow-hidden h-dvh -z-50`}>
      <div className='wave' />
      <div className='wave' />
      <div className='wave' />
    </div>
  );
};

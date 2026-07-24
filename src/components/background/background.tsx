import React from 'react';
import { useSecret } from '@context/SecretContext';
import './background.css';

export default function Background() {

  const { isSecretActive } = useSecret();

  return (
    <>
      <div className={`background ${isSecretActive && 'secret'} absolute top-0 left-0 overflow-hidden h-dvh -z-50`}>
        <div className='wave' />
        <div className='wave' />
        <div className='wave' />
      </div>
    </>
  );
};

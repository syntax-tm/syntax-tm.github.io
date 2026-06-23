import React from 'react';
import Secret from '@components/secret/Secret';
import './background.css';

export default function Background() {
  return (
    <>
      <div className="background absolute top-0 left-0 overflow-hidden h-dvh -z-50">
        <Secret />
        <div className='wave' />
        <div className='wave' />
        <div className='wave' />
      </div>
    </>
  );
};

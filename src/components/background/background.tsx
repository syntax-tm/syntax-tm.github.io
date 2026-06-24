import React from 'react';
import './background.css';

export default function Background() {
  return (
    <>
      <div className="background absolute top-0 left-0 overflow-hidden h-dvh -z-50">
        <div className='wave' />
        <div className='wave' />
        <div className='wave' />
      </div>
    </>
  );
};

import React from 'react';
import Secret from '@components/secret/Secret';
import './background.css';

export default function Background() {
    return (
      <>
        <div className="background absolute overflow-hidden h-dvh -z-50">
          <Secret />
          <div className='wave' />
          <div className='wave' />
          <div className='wave' />
        </div>
      </>
    )
};


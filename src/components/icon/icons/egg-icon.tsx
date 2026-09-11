'use client';

import React, { useMemo } from "react";
import { useXmb } from "@context";
import './egg-icon.scss';

export type EggProps = {
  className: string
  width: number,
  height: number,
  fill: string,
};

export const EggIcon = (props: EggProps) => {

  const { item } = useXmb();

  const isSelected = item && item === 'secrets';
  const cssClasses = props?.className
    ? `xmb-icon svg-inline--fa fa-egg ${props.className}`
    : 'xmb-icon svg-inline--fa fa-egg';
  const fill = isSelected
    ? 'url(#smil-chroma)'
    : 'currentColor';

  return (
    <svg
      aria-hidden="true"
      data-icon="egg"
      data-prefix="fas"
      viewBox="0 0 384 512"
      {...props}
      className={cssClasses}
    >
      <defs>
        <linearGradient
          id="smil-chroma"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ff0000" />
          <stop offset="25%" stopColor="#ffff00" />
          <stop offset="50%" stopColor="#00ff00" />
          <stop offset="75%" stopColor="#00ffff" />
          <stop offset="100%" stopColor="#0000ff" />
        </linearGradient>
      </defs>
      <path
        fill={fill}
        className={isSelected ? 'rgb-cycle' : ''}
        d="M192 496C86 496 0 394 0 288 0 176 64 16 192 16s192 160 192 272c0 106-86 208-192 208zm-37.2-362c6.5-6 7-16.1 1-22.6s-16.1-7-22.6-1c-23.9 21.8-41.1 52.7-52.3 84.2C69.7 226.2 64 259.7 64 288.1c0 8.8 7.2 16 16 16s16-7.2 16-16c0-24.5 5-54.4 15.1-82.8 10.1-28.5 25-54.1 43.7-71.2z"
      />
    </svg>
  );
};

export { EggIcon as default };

"use client";

import React from "react";
import Image from "next/image";

export type ControllerButton =
    | "a"
    | "b"
    | "d_pad_down"
    | "d_pad_left"
    | "d_pad_right"
    | "d_pad_up"
    | "d_pad"
    | "home"
    | "left_bumper"
    | "left_stick_all"
    | "left_stick_click"
    | "left_stick_down"
    | "left_stick_left_right"
    | "left_stick_left"
    | "left_stick_right"
    | "left_stick_up_down"
    | "left_stick_up"
    | "left_stick"
    | "left_trigger"
    | "menu"
    | "right_bumper"
    | "right_stick_all"
    | "right_stick_click"
    | "right_stick_down"
    | "right_stick_left_right"
    | "right_stick_left"
    | "right_stick_right"
    | "right_stick_up_down"
    | "right_stick_up"
    | "right_stick"
    | "right_trigger"
    | "share"
    | "view"
    | "x"
    | "y";

type ControllerIconStyle = "white" | "black";

interface ControllerIconProps {
    style?: ControllerIconStyle;
    icon: ControllerButton;
    className?: string;
    width?: number;
    height?: number;
    styleProps?: React.CSSProperties;
}

export default function ControllerIcon({
  style = "white",
  icon,
  className = "",
  width = 200,
  height = 200,
  styleProps = {},
}: ControllerIconProps) {
  return (
    <>
      <Image
        src={`/svg/xbox_${style}/${icon}.svg`}
        alt={`${style} ${icon}`}
        className={className}
        width={width}
        height={height}
      />
    </>
  );
}

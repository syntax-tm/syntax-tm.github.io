"use client";

import React from "react";
import { useTheme } from "@context";
import "./clock.scss";

export function ClockView() {
  const { currentTheme } = useTheme();

  const clock = currentTheme?.clock;

  return (
    <React.Fragment>
      {clock}
    </React.Fragment>
  );
}

export { ClockView as default };

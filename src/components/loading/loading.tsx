"use client";

import React from "react";
import "./loading.css";

export default function LoadingView() {
  return (
    <>
      <div className="loading anim-container absolute left-0 top-0 h-full w-full -z-2">
        <div className="anim"></div>
      </div>
    </>
  );
}

"use client";

import React from "react";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./loading.css";

export default function LoadingView() {
  return (
    <>
      <div className="anim-container absolute left-0 top-0 h-full w-full -z-2">
        <div className="anim"></div>
      </div>
    </>
  );
}

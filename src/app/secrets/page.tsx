"use client";

import React from "react";
import { ModalHeader, ModalClose } from "@components/modal/modal";
import SecretsView from "./secrets-view";
import "./secrets.css";

export default function SecretsPage() {

  return (
    <>
      <ModalHeader title="Secrets" />
      <div className=" w-full h-[70%]">
        <SecretsView />
      </div>
      <ModalClose />
    </>
  );
}


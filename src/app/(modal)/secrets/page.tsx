"use client";

import React from "react";
import { Modal } from "@components/modal/modal";
import SecretsView from "./secrets-view";
import "./secrets.scss";

export default function SecretsPage() {

  return (
    <>
      <Modal title="Secrets">
        <div className="w-full h-full grid">
          <SecretsView />
        </div>
      </Modal>
    </>
  );
}


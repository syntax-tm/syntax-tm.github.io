"use client";

import React from "react";
import { Modal, ModalMenuButton } from "@components/modal/modal";
import SecretsView from "./secrets-view";
import { faHandPointer } from "@fortawesome/free-solid-svg-icons";
import "./secrets.scss";

export default function SecretsPage() {

  const modalButton: ModalMenuButton = {
    key: 'p',
    title: 'password',
    description: '',
    url: '/secrets/input',
    controllerIcon: 'b',
    mobileIcon: faHandPointer,
  };

  return (
    <>
      <Modal title="Secrets" menuButton={modalButton}>
        <div className="w-full h-full grid">
          <SecretsView />
        </div>
      </Modal>
    </>
  );
}

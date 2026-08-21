"use client";

import React from "react";
import { Modal, ModalMenuButton } from "@components/modal/modal";
import SecretInput from "./secret-input";
import { useRouter } from "next/navigation";
import { faHandPointer } from "@fortawesome/free-solid-svg-icons";

export default function SecretsPage() {

  const router = useRouter();
  const modalButton: ModalMenuButton = {
    key: 'c',
    title: 'Cancel',
    description: '',
    action: () => {
      router.back();
    },
    controllerIcon: 'b',
    mobileIcon: faHandPointer,
  };

  return (
    <>
      <Modal title="Enter Password" menuButton={modalButton}>
        <div className="secret-input-wrapper">
          <SecretInput />
        </div>
      </Modal>
    </>
  );
}

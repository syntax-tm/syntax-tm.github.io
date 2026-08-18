"use client";

import React from "react";
import { Modal, ModalMenuButton } from "@components/modal/modal";
import SecretInput from "./secret-input";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace, faHandPointer } from "@fortawesome/free-solid-svg-icons";
import ControllerIcon from "@components/icons/controller-icon";

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

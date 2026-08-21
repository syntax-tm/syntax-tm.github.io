"use client";

import React from "react";
import { Modal, ModalMenuButton } from "@components/modal/modal";
import SecretsView from "./secrets-view";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useGamepads } from "awesome-react-gamepads";
import { useRouter } from "next/navigation";
import "./secrets.scss";

export default function SecretsPage() {

  const router = useRouter();
  const modalButton: ModalMenuButton = {
    key: 'p',
    title: 'password',
    description: '',
    url: '/secrets/input',
    controllerIcon: 'y',
    mobileIcon: faPenToSquare,
  };

  useGamepads({
    onY: () => {
      router.push('/secrets/input');
    },
  });

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

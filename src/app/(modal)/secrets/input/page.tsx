"use client";

import React, { Suspense } from "react";
import dynamic from 'next/dynamic';
import { Modal, ModalMenuButton } from "@components/modal/modal";
import { useRouter } from "next/navigation";
import { faHandPointer } from "@fortawesome/free-solid-svg-icons";

const SecretInput = dynamic(
  () => import('./secret-input'),
  { ssr: false },
);

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
          <Suspense>
            <SecretInput />
          </Suspense>
        </div>
      </Modal>
    </>
  );
}

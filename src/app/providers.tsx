'use client';

import React from "react";
import { AudioProvider } from "@context/AudioContext";
import { BootProvider } from "@context/BootContext";
import { SnackbarProvider } from "@context/SnackbarContext";
import { SecretProvider } from "@context/SecretContext";
import { XmbProvider } from "@/context/XmbContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      <BootProvider>
        <SnackbarProvider>
          <SecretProvider>
            <XmbProvider>
              {children}
            </XmbProvider>
          </SecretProvider>
        </SnackbarProvider>
      </BootProvider>
    </AudioProvider>
  );
}
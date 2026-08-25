'use client';

import React from "react";
//import { ProviderComposer } from "@providers/ProviderComposer";
import { AudioProvider } from "@context/AudioContext";
import { BootProvider } from "@context/BootContext";
import { SnackbarProvider } from "@context/SnackbarContext";
import { SecretProvider } from "@context/SecretContext";
import { ThemeProvider } from "@context/ThemeContext";
import { XmbProvider } from "@context/XmbContext";
import { SettingStoresProvider } from "@stores/setting-store";

export default function Providers({ children }: ({ children: React.ReactNode })) {
  return (
    <AudioProvider>
      <SnackbarProvider>
        <SettingStoresProvider>
          <SecretProvider>
            <ThemeProvider>
              <BootProvider>
                <XmbProvider>
                  {children}
                </XmbProvider>
              </BootProvider>
            </ThemeProvider>
          </SecretProvider>
        </SettingStoresProvider>
      </SnackbarProvider>
    </AudioProvider>
  );
}

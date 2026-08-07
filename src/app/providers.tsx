'use client';

import React from "react";
//import { ProviderComposer } from "@providers/ProviderComposer";
import { AudioProvider } from "@context/AudioContext";
import { BootProvider } from "@context/BootContext";
import { SnackbarProvider } from "@context/SnackbarContext";
import { SecretProvider } from "@context/SecretContext";
import { ThemeProvider } from "@context/ThemeContext";
import { XmbProvider } from "@context/XmbContext";
import { SettingsStoreProvider } from "@providers/settings-store-provider";

export default function Providers({ children }: ({ children: React.ReactNode })) {
  return (
    <>
      <AudioProvider>
        <SnackbarProvider>
          <SettingsStoreProvider>
            <SecretProvider>
              <ThemeProvider>
                <BootProvider>
                  <XmbProvider>
                    {children}
                  </XmbProvider>
                </BootProvider>
              </ThemeProvider>
            </SecretProvider>
          </SettingsStoreProvider>
        </SnackbarProvider>
      </AudioProvider>
    </>
  );
}

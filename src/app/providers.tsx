'use client';

import React, { ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { ProviderComposer } from "@providers/ProviderComposer";
import { AudioProvider } from "@context/AudioContext";
import { BootProvider } from "@context/BootContext";
import { SnackbarProvider } from "@context/SnackbarContext";
import { SecretProvider } from "@context/SecretContext";
import { ThemeProvider } from "@context/ThemeContext";
import { XmbProvider } from "@context/XmbContext";
import { SettingStoresProvider } from "@stores/setting-store";
import { XmbStoreProvider } from "@stores/xmb-store";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const providers = [
  (
    { children }: { children: ReactNode }) => (
    <MuiThemeProvider
      theme={darkTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  ),
  AudioProvider,
  SnackbarProvider,
  XmbStoreProvider,
  SettingStoresProvider,
  SecretProvider,
  ThemeProvider,
  BootProvider,
  XmbProvider,
];

export default function Providers({ children }: ({ children: ReactNode })) {
  return (
    <ProviderComposer providers={providers}>
      {children}
    </ProviderComposer>
  );
}

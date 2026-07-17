"use client";

import React from "react";
import type { Metadata, Viewport } from 'next';
import { Inter } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import "./globals.css";
import { SnackbarProvider } from "@context/SnackbarContext";
import { AudioProvider } from '@context/AudioContext';
import { BootProvider } from '@context/BootContext';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
//import localFont from 'next/font/local';

config.autoAddCss = false;

library.add(fas, fab);

// const xmbFont = localFont({
//   src: 'font.ttf',
//   variable: '--sce-ps3-rodin-font',
//   style: 'normal',
//   weight: "400",
//   preload: true,
// });



const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-white`}>
        <AudioProvider>
          <SnackbarProvider>
            <BootProvider>
              {children}
            </BootProvider>
          </SnackbarProvider>
        </AudioProvider>
      </body>
    </html>
  );
}

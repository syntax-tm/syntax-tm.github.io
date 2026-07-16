import React from "react";
import type { Metadata, Viewport } from 'next';
import { Inter } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import "./globals.css";
import Head from 'next/head';
import { SnackbarProvider } from "@context/SnackbarContext";
import { AudioProvider } from '@context/AudioContext';
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

export const metadata: Metadata = {
  title: 'Trey | Social, Games, and More Links',
  description: 'Profiles for gaming, social media, development, and more.',
  category: "Personal Website",
  publisher: "@syntax-tm",
  creator: "@syntax-tm",
};

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
    <html lang="en" className={inter.className}>
      <Head>
        <meta name="keywords" content={'trey, discord, gundwn, gundwn.gg, steam, xbox, syntax-tm, github, git, xmb, links, social, profile, games'} />
        <meta name="twitter:site" content="@gundwnsrc" />
      </Head>
      <body className={`${inter.className} text-white`}>
        <AudioProvider>
          <SnackbarProvider>
            {children}
          </SnackbarProvider>
        </AudioProvider>
      </body>
    </html>
  );
}

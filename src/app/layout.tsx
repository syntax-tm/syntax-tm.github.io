import React from "react";
import type { Metadata, Viewport } from 'next';
import { Inter } from "next/font/google";
import Link from "next/link";
import { config } from '@fortawesome/fontawesome-svg-core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import Providers from "@app/providers";
import '@fortawesome/fontawesome-svg-core/styles.css';
import "@styles/global.scss";

config.autoAddCss = false;

library.add(fas, fab);

export const metadata: Metadata = {
  title: 'Trey | Social, Games, and More Links',
  description: 'Profiles for gaming, social media, development, and more.',
  category: "Personal Website",
  publisher: "@syntax-tm",
  creator: "@syntax-tm",
  keywords: ['trey', 'discord', 'gundwn', 'gundwn.gg', 'steam', 'xbox', 'syntax-tm', 'github', 'git', 'xmb', 'links', 'social', 'profile', 'games', 'next.js', 'react', 'psp', 'ps3'],
  twitter: {
    site: "@gundwnsrc",
  },
};

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body id="body" className={`${inter.className} text-white`}>
        <Providers>
          {children}
          {modal}
        </Providers>
        {/* Invisible anchor strictly to trigger Next.js route preloading */}
        <div style={{ display: 'none' }}>
          <Link href="/not-found-page" prefetch={true} />
        </div>
      </body>
    </html>
  );
}

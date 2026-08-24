"use client";

import { usePathname } from 'next/navigation';

const EMPTY_PATH = '';
const ROOT_PATH = '/';
const BOOT_PATH = '/boot';
const BRIX_PATH = '/brix';
const WII_PATH = '/wii';
const IGNORED_PATHS = [ EMPTY_PATH, ROOT_PATH, BOOT_PATH, BRIX_PATH, WII_PATH ];

export interface PathOutput {
  modal: boolean;
  pathname: string;
}

export const usePath = (): PathOutput => {

  const pathname = usePathname();

  const modal = !IGNORED_PATHS.includes(pathname.toLowerCase());

  return {
    modal,
    pathname,
  };
};

export { usePath as default };

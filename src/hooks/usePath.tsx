"use client";

import { usePathname } from 'next/navigation';

const EMPTY_PATH = '';
const ROOT_PATH = '/';
const BOOT_PATH = '/boot';
const IGNORED_PATHS = [ EMPTY_PATH, ROOT_PATH, BOOT_PATH ];

export interface PathOutput {
  modal: boolean;
  pathname: string;
  //searchParams: ReadonlyURLSearchParams;
}

const usePath = (): PathOutput => {

  const pathname = usePathname();
  //const searchParams = useSearchParams();

  //const modal = (pathname !== ROOT_PATH && pathname !== BOOT_PATH);
  const modal = !IGNORED_PATHS.includes(pathname);

  return {
    modal,
    pathname,
    //searchParams,
  };
};

export default usePath;

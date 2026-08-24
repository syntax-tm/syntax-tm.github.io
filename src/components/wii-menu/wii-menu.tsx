'use client';

import React, { useEffect, useState, MouseEvent, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import localFont from 'next/font/local';
import Link from 'next/link';
import { useWindowSize } from "@uidotdev/usehooks";
import { chunkArray } from 'utils';
import { WiiClock } from './wii-clock';
import { useNavigation, WiiNavigationProvider } from './wii-navigation-context';
import WiiHomeLayoutImage from "svg/wii_home_layout_final.svg";
import './cursors.css';
import './wii.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

const defaultFont = localFont({
  src: './fonts/BitstreamVeraSansMono-Bold.woff2',
  preload: true,
  weight: '400',
  variable: '--font-bitstream-versa-sans-mono',
});

export interface WiiMenuItemProps {
  id: number;
  title: string;
  page: number;
  index: number;
  className?: string;
}

export interface WiiMenuPageProps {
  id: number;
  index: number;
  items: WiiMenuItemProps[];
}

export function WiiMenuItem({ id, title, page, index, className }: WiiMenuItemProps) {

  // const elementRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const open = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // useEffect(() => {

  //   if (!elementRef.current) return;

  //   const onHover = () => {
  //     setIsHovered(true);
  //   };

  //   const onLeave = () => {
  //     setIsHovered(false);
  //   };

  //   elementRef.current.addEventListener('mouseover', onHover);
  //   elementRef.current.addEventListener('mouseleave', onLeave);

  //   return () => {
  //     elementRef.current?.removeEventListener('mouseover', onHover);
  //     elementRef.current?.removeEventListener('mouseleave', onLeave);
  //   };

  // }, []);

  return (
    <button
      className={`wii-menu-item group grid border-2 peer-hover:border-gray-400 bg-blue-400 hover:bg-blue-700/75 rounded-xl ${className}`}>
      <Link href={`/wii?item=${index}`} onClick={open} className="flex w-full h-full justify-center">
        <div className="text-2xl xl:text-4xl text-wrap text-ellipsis text-center self-center">
          {title}
        </div>
      </Link>
    </button>
  );

}

export const WiiSystemMenu = () => {

  return (
    <dialog>
      <div className="wii-system-menu h-screen w-screen grid relative">
        <div className="">
          <div className="flex">

          </div>
          <hr />
        </div>
        <div className="">

        </div>
        <div className="">

        </div>
      </div>
    </dialog>
  );

};

export function WiiMenu() {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [items] = useState<Record<number, WiiMenuItemProps>>({ });
  const [pages] = useState<WiiMenuPageProps[]>([]);
  const [currentPage, setCurrentPage] = useState<WiiMenuPageProps | null>(null);
  const size = useWindowSize();
  const navigation = useNavigation();

  //console.log(JSON.stringify(navigation));

  useEffect(() => {
    // load the current page from the search param
    const pageParam = searchParams.get('page');
    if (!pageParam) return;

    navigation.setPage(Number(pageParam));

    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    const queryString = params.toString();
    const updatedUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(updatedUrl, { scroll: false });
  }, [searchParams]);

  useEffect(() => {

    if (!pages) return;

    const index = navigation.currentPage;
    const page = pages[index];

    setCurrentPage(page);

  }, [navigation, pages]);

  useEffect(() => {

    if (pages && pages.length > 0) return;

    const menuItems = Array.from({ length: 100 }, (_, index) => index + 1);
    const itemChunks = chunkArray(menuItems, 12);

    let index = 0;

    for (let i = 0; i < itemChunks.length; i++) {
      const chunk = itemChunks[i];
      const pageItems = [];

      for (let j = 0; j < chunk.length; j++) {
        const item: WiiMenuItemProps = {
          id: index,
          index: j,
          title: `Item ${index}`,
          page: i,
        };

        items[index] = item;

        pageItems.push(item);

        index++;
      }

      const page: WiiMenuPageProps = {
        id: i,
        index: i,
        items: pageItems,
      };

      pages.push(page);
    }

    setCurrentPage(pages[0]);

    navigation.setPageTotal(pages.length);
  }, []);

  return (
    <div className={`wii-menu absolute w-full h-full left-0 top-0 ${defaultFont.className} secret-wii overflow-hidden cursor-wii-auto cursor-(--cursor-wii-auto)`}>
      <Image src={'svg/wii_layout_home.svg'} alt="wii home layout" width={size?.width ?? 100} height={size?.height ?? 100} className='absolute z-0 bottom-0 left-0' preload={true} />
      <div className="app">
        <div className="main-menu px-15 pt-6 grid">
          <div className="grid grid-flow-row-dense grid-cols-4 grid-rows-3 gap-3 block-7/10 z-1">
            {
              currentPage &&
                currentPage.items &&
                currentPage.items.map(i => {
                  return (
                    <WiiMenuItem key={i.index} {...i} />
                  );
                })
            }
          </div>
          <div className="absolute left-0 top-0 w-full grid h-full">
            <div className="grid grid-cols-2 align-middle h-[75%] p-2">
              <div className="self-center align-middle flex items-start content-start justify-start">
                {
                  navigation.allowPrev && (
                    <button className="opacity-50 has-hover:opacity-100 has-hover:not-disabled:bg-gray-500 rounded-xl ml-3 p-5 aspect-square z-10" onClick={navigation.movePrev} disabled={!navigation.allowPrev}>
                      {/* <FontAwesomeIcon icon={faCaretLeft} className="hover:animate-pulse text-blue-400 self-start h-full" size="4x" /> */}
                      <Image src={'svg/wii/wii_nav_left.svg'} width={30} height={30} alt="previous page" className="wii-menu-page-button hover:cursor-grab" />
                    </button>
                  )
                }
              </div>
              <div className="self-center align-middle flex items-start content-end justify-end">
                {
                  navigation.allowNext && (
                    <button className="opacity-50 has-hover:opacity-100 has-hover:not-disabled:bg-gray-500 rounded-xl mr-3 py-2 z-10" onClick={navigation.moveNext} disabled={!navigation.allowNext}>
                      <FontAwesomeIcon icon={faCaretRight} className="hover:animate-pulse text-blue-400 self-start h-full" size="4x" />
                    </button>
                  )
                }
              </div>
            </div>
          </div>
          <div className="wii-status-bar absolute bottom-0 left-0 h-[30%] w-full grid">
            <WiiClock />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WiiMenuWrapper() {
  return (
    <WiiNavigationProvider>
      <Suspense>
        <WiiMenu />
      </Suspense>
    </WiiNavigationProvider>
  );
}

export { WiiMenuWrapper as default };

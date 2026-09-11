"use client";

import React, { MouseEventHandler, useMemo, useState } from "react";
import { IXmbItem } from "types/xmb";
import { useXmb } from "@context/XmbContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { Divider, MenuItem, MenuList, Modal } from "@mui/material";
import * as icons from "@mui/icons-material";
import { useLongPress } from "@uidotdev/usehooks";
import { log } from "utils";
// import "./xmb.scss";

interface MenuItemProps {
  catIndex: number;
  index: number;
  item: IXmbItem;
  id: string;
  className?: string;
}

export const XmbMenuItem = ({ catIndex, index, item, id, className }: MenuItemProps) => {
  const { openItem, x, updateY, item: currentItem } = useXmb();
  const isActive = x === catIndex && currentItem === item.type;
  const isDisabled = useMemo(() => {
    return !item.isEnabled || !item.link;
  }, [item]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleOpenMenu = () => {
    if (!isActive) {
      updateY(index);
    }

    setIsMenuOpen(true);
  };
  const handleCloseMenu = () => setIsMenuOpen(false);

  useLongPress(() => {
    setIsMenuOpen(true);
  }, { threshold: 500 });

  const handleClick: MouseEventHandler = (e) => {
    if (isDisabled) return;
    if (item.isHidden) return;

    e.preventDefault();

    // move the selection to this item
    if (!isActive) {
      updateY(index);
    }

    // open the item
    openItem(item);
  };

  // transition={{ type: "spring", stiffness: 100, bounceDamping: 30, visualDuration: 0.25 }}>

  return (
    <div className={className ? className : ''}>
      <div>
        <div className={`backdrop-blur-xs ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} />
        <Modal
          open={isMenuOpen}
          onClose={handleCloseMenu}
          className="absolute top-[50%] left-[50%] w-scren h-screen shadow-2xl drop-shadow-black p-4 grid">
          <MenuList
            className="w-50 self-center place-self-center justify-self-center bg-zinc-800 border border-gray-500/50">
            <MenuItem disabled title={item.type} className="text-center font-bold">
              <span style={{ width: '100%', display: 'grid' }}>{item.title}</span>
            </MenuItem>
            <Divider />
            <MenuItem>
              <icons.OpenInNew  />
              <Divider orientation="vertical" />
              <span className="mx-2">Open</span>
            </MenuItem>
            <MenuItem>
              <icons.ContentCopy  />
              <Divider orientation="vertical" />
              <span className="mx-2">Copy</span>
            </MenuItem>
            <Divider />
            <MenuItem action={() => {
              handleCloseMenu();
            }}>
              <icons.Close  />
              <Divider orientation="vertical" />
              <span className="mx-2">Close</span>
            </MenuItem>
          </MenuList>
        </Modal>
      </div>
      <motion.div
        layoutId={id}
        layout="position"
        initial={false}
        transition={{ duration: 0.15, ease: 'circInOut' }}>
        <Link
          id={item.type}
          className={`xmb-item flex justify-self-center place-self-center self-center select-none ${item.isHidden ? 'opacity-0' : ''} ${isDisabled ? 'disabled pointer-events-none cursor-not-allowed' : ''} ${isActive ? 'active' : ''} ${!index ? 'first' : ''}`}
          href={item.link || ""}
          data-index={index}
          data-active={isActive}
          onClick={handleClick}
          onContextMenu={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpenMenu();
          }}
          // onMouseDown={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          //   if (e.button === 0) return;
          //   e.preventDefault();
          //   e.stopPropagation();
          //   handleOpenMenu();
          // }}
          target={item.link && "_blank" || undefined}
          aria-disabled={isDisabled}>
          <div className="flex auto-cols-max w-full overflow-visible relative">
            <div className={`grid relative w-full content-center overflow-visible place-content-center place-self-center justify-items-center place-items-center items-center`}>
              {item.icon.element}
              <div className="justify-self-start absolute left-full top-0 h-full self-center flex flex-col place-content-center gap-2 md:gap-4 lg:gap-5">
                <div className="xmb-item-name text-nowrap select-none text-2xl md:text-3xl">
                  {item.title}
                </div>
                {item.description && (
                  <div className="xmb-item-description text-nowrap select-none text-lg md:text-xl">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export { XmbMenuItem as default };

"use client";

import React, { MouseEventHandler } from "react";
import { XmbItem } from "types/xmb";
import { useXmb } from "@context/XmbContext";
import Link from "next/link";
import "./xmb.scss";

interface MenuItemProps {
  catIndex: number;
  index: number;
  item: XmbItem;
}

export const MenuItem = ({ catIndex, index, item }: MenuItemProps) => {
  const { x, y, openItem, updateY } = useXmb();
  const isActive = x === catIndex && y === index;

  const handleClick: MouseEventHandler = (e) => {
    e.preventDefault();

    // move the selection to this item
    updateY(index);

    // open the item
    openItem(item);
  };

  return (
    <>
      <Link
        id={item.id}
        className={`relative xmb-item flex justify-self-center select-none ${isActive ? "active" : "inactive"} ${!index && "first"}`}
        href={item.link || ""}
        data-index={index}
        data-active={isActive}
        data-off={index < y}
        onClick={handleClick}
        target={item.link && "_blank" || undefined}>
        <div className="grid grid-cols-1 overflow-visible relative">
          <div className="overflow-visible justify-items-center">
            {item.icon}
          </div>
          <div className="absolute pl-30 h-full m-1.25 -ml-3 lg:ml-0 align-middle place-content-evenly">
            <div className="-mt-5 h-full grid grid-cols-1 content-center auto-rows-max select-none w-300 text-left">
              <div className="row xmb-item-name text-nowrap select-none">
                {item.title}
              </div>
              {item.description && (
                <div className="row xmb-item-description text-nowrap select-none">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

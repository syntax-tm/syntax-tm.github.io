"use client";

import React, { useEffect, useState } from "react";
import { XmbItem } from "@models/menu";
import { useXmb } from "@context/XmbContext";
import Link from "next/link";
import "./xmb.scss";

interface MenuItemProps {
  catIndex: number;
  index: number;
  item: XmbItem;
  openItem: (item: XmbItem) => void;
}

export const MenuItem = ({ catIndex, index, item, openItem }: MenuItemProps) => {
  const { x, y } = useXmb();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const active = x === catIndex
    && y === index;
    setIsActive(active);
  }, [x, y]);

  return (
    <>
      <Link
        id={item.id}
        className={`relative xmb-item flex justify-self-center select-none ${isActive ? "active" : "inactive"} ${!index && "first"}`}
        href={item.link || ""}
        data-index={index}
        data-active={isActive}
        onClick={(e) => {
          e.preventDefault();
          openItem(item);
        }}
        target={item.link && "_blank" || undefined}>
        <div className="grid grid-cols-1 overflow-visible relative">
          <div className="w-30 overflow-visible">
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

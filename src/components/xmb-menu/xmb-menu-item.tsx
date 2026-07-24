"use client";

import React, { CSSProperties, useMemo } from "react";
import { XmbItem } from "@models/menu";
import { useXmb } from "@context/XmbContext";
import { useWindowSize } from "@uidotdev/usehooks";
import useMobileDetect from "@hooks//useMobileDetect";
import Link from "next/link";
import "./xmb.css";
import { useMessenger, EventName } from "@src/context/MessageContext";

interface MenuItemProps {
  catIndex: number;
  index: number;
  item: XmbItem;
  openItem: (item: XmbItem) => void;
}

export const MenuItem = ({ catIndex, index, item, openItem }: MenuItemProps) => {
  const size = useWindowSize();
  const platform = useMobileDetect();
  const { x, y, toXmbKey } = useXmb();
  //const { publish, subscribe, unsubscribe } = useMessenger();

  //const isVisible = x === catIndex;
  const active = x === catIndex
    && y === index;

  // const eventKey = useMemo(() => {
  //   toXmbKey(catIndex, index);
  // }, []);

  const style = useMemo(() => {
    let top, bottom;

    const height = size?.height ?? 0;
    const width = size?.width ?? 0;
    const isPortrait = height > width;

    if (platform.isMobile() || isPortrait) {
      top = index === 0
        ? (active ? 30 : -300 + -110 * y)
        : (active ? 350 : 30);
      bottom = index === 0
        ? (active ? 40 : 0)
        : 30;
    } else {
      top = index === 0
        ? (active ? 50 : -190 + -120 * y)
        : (active ? 250 - 5 * y : 15);
      bottom = index === 0
        ? (active ? 30 : 20)
        : (active ? 20 : 30);
    }

    const styleProps: CSSProperties = {
      marginTop: `${top}px`,
      marginBottom: `${bottom}px`,
    };

    return styleProps;
  }, [y, size, active]);

  return (
    <>
      <Link
        id={item.id}
        className={`w-100 max-w-[120px] relative xmb-item flex justify-self-center select-none ${active ? "active" : "inactive"} ${!index && "first"}`}
        style={style}
        href={item.link || ""}
        data-index={index}
        data-active={active}
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

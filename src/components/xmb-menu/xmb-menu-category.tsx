"use client";

import React, { MouseEventHandler, useMemo } from "react";
import { IXmbCategory } from "types/xmb";
import { useXmb } from "@context/XmbContext";
import { XmbMenuItem } from "./xmb-menu-item";
import { useSecret } from "@context";
import { LayoutGroup } from "framer-motion";
import { StyleProps } from "types";
// import "./xmb.scss";

interface MenuCategoryProps {
  index: number;
  category: IXmbCategory;
  className?: string;
}

export const MenuCategory = ({ index, category, className }: MenuCategoryProps) => {

  const { isDebug } = useSecret();
  const { x, y, updateX } = useXmb();
  const isActive = x === index;
  const styleProps: StyleProps = { '--y': y };

  const handleClick: MouseEventHandler = (e) => {
    if (isActive) return;

    e.preventDefault();

    updateX(index);
  };

  const topItems = isActive ? category.items?.filter((_item, index) => index < y) : undefined;
  const bottomItems = isActive ? category.items?.filter((_item, index) => index >= y) : undefined;

  const topSection = useMemo(() => {
    if (!topItems?.length) return null;
    return (
      <React.Fragment>
        <div className={`xmb-category-top-items flex flex-col ${isDebug ? 'bg-purple-300/50' : ''} content-end absolute place-content-end bottom-full origin-top overflow-visible mb-5`}>
          {
            topItems.map((item, i) => {
              const key = category.type.toLowerCase() + '-' + item.type;
              return (
                <XmbMenuItem id={key} key={key} catIndex={index} index={i} item={item} />
              );
            })
          }
        </div>
      </React.Fragment>
    );
  }, [topItems, isDebug, category]);

  const bottomSection = useMemo(() => {
    if (!bottomItems?.length) return null;
    return (
      <React.Fragment>
        <div className={`xmb-category-bottom-items flex flex-col ${isDebug ? 'bg-green-400/50' : ''}`}>
          {
            bottomItems.map((item, i) => {
              const key = category.type.toLowerCase() + '-' + item.type;
              const className = i === 0 ? 'active' : '';
              return (
                <XmbMenuItem id={key} key={key} catIndex={index} index={i} item={item} className={className} />
              );
            })
          }
        </div>
      </React.Fragment>
    );
  }, [bottomItems, isDebug, category]);

  return (
    <React.Fragment key={category.type}>
      <div className={`h-full relative overflow-visible ${className && className} ${isDebug ? 'border-2 border-blue-600' : ''}`}>
        <div id={category.title}
          className={`xmb-category ${ isActive ? 'active' : '' } flex flex-col relative`}
          data-index={index}
          data-active={isActive}
          style={styleProps}
          onClick={handleClick}
        >
          <LayoutGroup>
            {topSection}
          </LayoutGroup>
          <div className={`xmb-category-header grid hover:cursor-pointer overflow-visible w-full p-2 aspect-square ${isDebug ? 'bg-fuchsia-300/50' : ''}`}>
            <div className="xmb-category-icon relative overflow-visible w-full h-full aspect-square grid justify-center">
              {category.icon.element}
            </div>
            {isActive && (
              <p className="xmb-category-title select-none text-center text-xl">
                {category.title}
              </p>
            )}
          </div>
          <div className={`flex flex-col ${isDebug ? 'bg-cyan-400/25' : ''} mt-4 self-center align-middle place-content-center place-items-start justify-center justify-items-center w-full`}>
            <LayoutGroup>
              {bottomSection}
            </LayoutGroup>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export { MenuCategory as default };

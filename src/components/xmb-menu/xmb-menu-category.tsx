"use client";

import React, { MouseEventHandler } from "react";
import { IXmbCategory } from "types/xmb";
import { useXmb } from "@context/XmbContext";
import { MenuItem } from "./xmb-menu-item";
import "./xmb.scss";

interface MenuCategoryProps {
  index: number;
  category: IXmbCategory;
}

export const MenuCategory = ({ index, category }: MenuCategoryProps) => {

  const { x, y, updateX } = useXmb();
  const isActive = x === index;

  const handleClick: MouseEventHandler = (e) => {
    if (isActive) return;

    e.preventDefault();

    updateX(index);
  };

  return (
    <>
      <div id={category.title}
        className={`xmb-category ${ isActive ? 'active' : 'inactive' }`}
        data-index={index}
        data-active={isActive}
        style={{ '--y': y } as React.CSSProperties}
        onClick={handleClick}
      >
        <div className={`xmb-category-header grid hover:cursor-pointer`}>
          {category.icon}
          {isActive && (
            <p className="xmb-category-title select-none">
              {category.title}
            </p>
          )}
        </div>
        {isActive && (
          <div className="xmb-category-items select-none" data-y={y}>
            {category.items &&
              category.items.map((item, i) => (
                <MenuItem
                  catIndex={index}
                  index={i}
                  key={item.id}
                  item={item}
                />
              ),
              )}
          </div>
        )}
      </div>
    </>
  );
};

export { MenuCategory as default };

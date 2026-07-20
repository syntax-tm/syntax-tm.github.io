"use client";

import React, { MouseEvent, RefObject, useCallback } from "react";

import { XmbMenu, XmbCategory } from "@models/menu";
import { MenuItem } from "./xmb-menu-item";
import "./xmb.css";

interface MenuCategoryProps {
  index: number;
  category: XmbCategory;
  x: number;
  y: number;
  menuRef: RefObject<XmbMenu | null>;
}

export const MenuCategory = ({ index, category, x, y, menuRef }: MenuCategoryProps) => {

  const active = index === x;

  const handleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const xmb = menuRef.current;
    if (xmb === null) return;
    xmb.setX(x);
  }, [menuRef]);

  return (
    <>
      <div id={category.title} className={`xmb-category ${ active ? 'active' : 'inactive' }`}
      >
        <div className="xmb-category-header grid hover:cursor-pointer" onClick={handleClick}>
          {category.icon}
          {active && (
            <p className="xmb-category-title select-none">
              {category.title}
            </p>
          )}
        </div>
        {active && (
          <div className="xmb-category-items select-none">
            {category.items !== undefined &&
              category.items.length > 0 &&
              category.items.map((item, i) => (
                <MenuItem
                  index={i}
                  key={item.id}
                  item={item}
                  y={y}
                />
              ),
              )}
          </div>
        )}
      </div>
    </>
  );
};

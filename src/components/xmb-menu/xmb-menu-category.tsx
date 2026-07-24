"use client";

import React, { useState, useEffect } from "react";
import { XmbCategory, XmbItem } from "@models/menu";
import { useXmb } from "@context/XmbContext";
import { MenuItem } from "./xmb-menu-item";
import "./xmb.css";

interface MenuCategoryProps {
  index: number;
  category: XmbCategory;
  openItem: (item: XmbItem) => void;
}

export const MenuCategory = ({ index, category, openItem }: MenuCategoryProps) => {

  const { x } = useXmb();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const active = x === index;
    setIsActive(active);
  }, [x]);

  return (
    <>
      <div id={category.title}
        className={`xmb-category ${ isActive ? 'active' : 'inactive' }`}
        data-index={index}
        data-active={isActive}
      >
        <div className="xmb-category-header grid hover:cursor-pointer">
          {category.icon}
          {isActive && (
            <p className="xmb-category-title select-none">
              {category.title}
            </p>
          )}
        </div>
        {isActive && (
          <div className="xmb-category-items select-none">
            {category.items &&
              category.items.map((item, i) => (
                <MenuItem
                  catIndex={index}
                  index={i}
                  key={item.id}
                  item={item}
                  openItem={openItem}
                />
              ),
              )}
          </div>
        )}
      </div>
    </>
  );
};

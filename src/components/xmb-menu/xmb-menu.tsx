"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MenuCategory } from "./xmb-menu-category";
import { useXmb } from "@context/XmbContext";
import { LayoutGroup, motion } from "framer-motion";
import { StyleProps } from "types";
import "./new-xmb.scss";

export function Menu() {

  const { menu, x, y } = useXmb();
  const styleProps: StyleProps = { '--x': x, '--y': y };
  const leftCategories = menu?.items.filter(c => c.index < x);
  const rightCategories = menu?.items.filter(c => c.index >= x);
  const router = useRouter();

  useEffect(() => {

    router.prefetch('/about');
    router.prefetch('/copy');
    router.prefetch('/help');
    router.prefetch('/secrets');

  }, []);

  const leftSection = useMemo(() => {

    if (!leftCategories) return null;
    return (
      <React.Fragment>
        {
          leftCategories.map(c => {
            return (
              <LayoutGroup key={c.type} id={c.type}>
                <motion.div layout="x" layoutId={c.type}
                  transition={{ duration: 0.15, ease: 'circInOut' }}>
                  <MenuCategory
                    index={c.index}
                    key={c.type}
                    category={c}
                    className={`xmb-menu-category`}
                  />
                </motion.div>
              </LayoutGroup>
            );
          })
        }
      </React.Fragment>
    );

  }, [leftCategories]);

  const rightSection = useMemo(() => {

    if (!rightCategories) return null;
    return (
      <React.Fragment>
        {
          rightCategories.map(c => {
            return (
              <LayoutGroup key={c.type} id={c.type}>
                <motion.div layout="x" layoutId={c.type}
                  transition={{ duration: 0.15, ease: 'circInOut' }}>
                  <MenuCategory
                    index={c.index}
                    key={c.type}
                    category={c}
                    className={`xmb-menu-category`}
                  />
                </motion.div>
              </LayoutGroup>
            );
          })
        }
      </React.Fragment>
    );

  }, [rightCategories]);

  return (
    <LayoutGroup>
      <div className={`xmb-root overflow-hidden absolute inset-0`} style={styleProps}>
        <div id="menu" className={`xmb-menu relative overflow-visible mt-50 flex flex-row place-content-between h-full gap-10 md:gap-30`} data-x={x} style={{ '--x': x } as React.CSSProperties}>
          <div className="xmb-category-left flex flex-row items-end absolute right-full origin-right gap-5 mr-5 md:gap-30 md:mr-30">
            <LayoutGroup>
              {leftSection}
            </LayoutGroup>
          </div>
          <div className="xmb-category-right flex flex-row gap-5 md:gap-30">
            <LayoutGroup>
              {rightSection}
            </LayoutGroup>
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}

export { Menu as default };

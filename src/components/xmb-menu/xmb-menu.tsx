"use client";

import React, { useEffect } from "react";
import { MenuCategory } from "./xmb-menu-category";
import { useXmb } from "@context/XmbContext";
import "./xmb.scss";
import { useRouter } from "next/navigation";

export default function Menu() {

  const { openItem, menu, x } = useXmb();
  const router = useRouter();

  useEffect(() => {

    router.prefetch('/about');
    router.prefetch('/copy');
    router.prefetch('/help');
    router.prefetch('/secrets');

  }, []);

  return (
    <div className='xmb-menu fixed w-full h-full' data-x={x} style={{ '--x': x } as React.CSSProperties}>
      <main id="menu" className="">
        <section className="xmb-main w-max flex mr-0 ml-35 md:ml-67.5">
          {
            menu
            && menu.items.map((item, i) => (
              <MenuCategory
                index={i}
                key={item.title}
                category={item}
                openItem={openItem}
              />
            ))
          }
        </section>
      </main>
    </div>
  );
};

import { ReactElement } from "react";
import { XmbItem } from "./xmb-item";

interface IXmbCategory {
  index: number;
  title: string;
  icon: ReactElement;
  items: XmbItem[];
  itemCount: number;
}

export class XmbCategory implements IXmbCategory {
  index: number;
  title: string;
  icon: ReactElement;
  items: XmbItem[];
  itemCount: number = 0;

  constructor(index: number, title: string, icon: ReactElement, items: XmbItem[]) {
    this.index = index;
    this.title = title;
    this.icon = icon;
    this.items = items;
    this.itemCount = this.items.length;
  }
}

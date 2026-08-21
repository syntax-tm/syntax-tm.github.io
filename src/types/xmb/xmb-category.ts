import { ReactElement } from "react";
import { IXmbCategory, ICategory, IXmbItem } from "./interfaces";

export class XmbCategory implements IXmbCategory, ICategory {
  index: number;
  title: string;
  icon: ReactElement;
  items: IXmbItem[];
  itemCount: number = 0;

  constructor(index: number, title: string, icon: ReactElement, items: IXmbItem[]) {
    this.index = index;
    this.title = title;
    this.icon = icon;
    this.items = items;
    this.itemCount = this.items.length;
  }
}

export { XmbCategory as default };

import { ReactElement } from "react";
import { IXmbItem } from "./xmb-item";

export interface IXmbCategory {
  index: number;
  title: string;
  icon: ReactElement;
  items: IXmbItem[];
  itemCount: number;
}

export class XmbCategory implements IXmbCategory {
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

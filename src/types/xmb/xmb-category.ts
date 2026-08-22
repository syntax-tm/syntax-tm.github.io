import { ReactElement } from "react";
import { IXmbCategory, IXmbItem } from "./interfaces";
import { XmbItem } from "./xmb-item";

export class XmbCategory implements IXmbCategory {
  private _items: IXmbItem[];
  index: number;
  title: string;
  icon: ReactElement;
  itemCount: number = 0;

  constructor(index: number, title: string, icon: ReactElement, items: IXmbItem[] = []) {
    this.index = index;
    this.title = title;
    this.icon = icon;
    this._items = items;
    this.itemCount = items.length;
  }

  get items(): IXmbItem[] {
    return this._items;
  }

  set items(value: IXmbItem[]) {
    this._items = value;
    this.itemCount = value.length;
  }

  addItem(id: string, title: string = '', icon: ReactElement | null = null, link?: string | null, description?: string | null, isEnabled?: boolean, isHidden?: boolean) {
    const item = new XmbItem(id, title, icon, link, description, isEnabled, isHidden, this);
    if (!this._items) {
      this._items = [];
    }
    this._items.push(item);
  }
}

export { XmbCategory as default };

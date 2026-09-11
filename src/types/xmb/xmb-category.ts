import { IXmbCategory, IXmbItem } from "./interfaces";
import { XmbItem } from "./xmb-item";
import { Category, MenuItemType } from "@enums";
import { IconBase } from "./xmb-icon";

export class XmbCategory implements IXmbCategory {
  private _items: IXmbItem[];
  index: number;
  title: string;
  icon: IconBase;
  itemCount: number = 0;
  type: Category;

  constructor(type: Category, index: number, title: string, icon: IconBase, items: IXmbItem[] = []) {
    this.type = type;
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

    this.refresh();
  }

  refresh() {
    if (!this._items) return;
    this._items.forEach((v, i) => {
      v.index = i;
      v.category = this;
    });
  }

  addItem(type: MenuItemType, title: string, icon: IconBase, link?: string | null, description?: string | null, isEnabled?: boolean, isHidden?: boolean) {
    if (!this._items) {
      this._items = [];
    }
    const item = new XmbItem(type, title, icon, link, description, isEnabled, isHidden, this._items.length, this);
    this._items.push(item);

    this.refresh();
  }
}

export { XmbCategory as default };

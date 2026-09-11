import { Category } from "@enums";
import { IXmbCategory, IXmbMenu } from "./interfaces";

export class XmbMenu implements IXmbMenu {
  [index: number]: IXmbCategory;
  private _items: IXmbCategory[];

  constructor(items: IXmbCategory[]) {
    this._items = items;
  }

  get items(): IXmbCategory[] {
    return this._items;
  }

  set items(value: IXmbCategory[]) {
    this._items = value;
  }

  refresh() {
    this._items.forEach((c, i) => {
      c.index = i;
      c.refresh();
    });
  }

  get(cat: Category) {
    return this._items.find(c => c.type === cat);
  }
}

export { XmbMenu as default };

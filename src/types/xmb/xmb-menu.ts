import { IXmbCategory, IXmbMenu } from "./interfaces";
import XmbCategory from "./xmb-category";

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
}

export { XmbMenu as default };

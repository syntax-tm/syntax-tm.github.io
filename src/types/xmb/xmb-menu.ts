import { XmbCategory } from "./xmb-category";
import { Position } from "types";

interface IXmbMenu {
  [index: number]: XmbCategory;

  items: XmbCategory[];

  getCategory(p: number | Position): XmbCategory;
}

export class XmbMenu implements IXmbMenu {
  [index: number]: XmbCategory;
  items: XmbCategory[];

  constructor(items: XmbCategory[]) {
    this.items = items;
  }

  // TODO: remove this, put this in a utility function instead
  getCategory(p: number | Position): XmbCategory {
    if (typeof p === "number") {
      return this.items[p];
    }
    return this.items[p.x];
  }
}

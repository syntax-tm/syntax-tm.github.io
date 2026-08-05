import { XmbCategory } from "./xmb-category";

interface IXmbMenu {
  [index: number]: XmbCategory;

  items: XmbCategory[];
}

export class XmbMenu implements IXmbMenu {
  [index: number]: XmbCategory;
  items: XmbCategory[];

  constructor(items: XmbCategory[]) {
    this.items = items;
  }
}

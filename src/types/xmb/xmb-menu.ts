import { IXmbCategory, XmbCategory } from "./xmb-category";

export interface IXmbMenu {
  [index: number]: XmbCategory;

  items: XmbCategory[];
}

export class XmbMenu implements IXmbMenu {
  [index: number]: XmbCategory;
  items: XmbCategory[];

  constructor(items: IXmbCategory[]) {
    this.items = items;
  }
}

import { IXmbCategory, ICategory, IXmbMenu, IMenu } from "./interfaces";

export class XmbMenu implements IXmbMenu, IMenu {
  [index: number]: IXmbCategory;
  items: IXmbCategory[];

  constructor(items: IXmbCategory[]) {
    this.items = items;
  }
}

export { XmbMenu as default };

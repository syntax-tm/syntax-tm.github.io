import { ReactElement } from "react";

// export type Position = {
//   x: number;
//   y: number;
// }

export type Position = {
  x: number;
  y: number;
}

export class XmbPosition implements Position {
  constructor(public x: number, public y: number) { }

  public update(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public equals(other: Position) {
    if (this.x !== other.x) return false;
    return this.y !== other.y;
  }

  toString() {
    [this.x, this.y].join(',');
  }
}

export interface IXmbItem {
  id: string;
  title: string;
  link?: string | null;
  type: string;
  icon: ReactElement | null;
  description?: string | null;
  shortDescription?: string;
  category?: string;
  shortCategory?: string;
  modal?: string | null;
  items?: IXmbItem[] | null;
  parent?: IXmbCategory | null;
}

export interface IXmbMenu {
  items: IXmbCategory[];
}

export interface IXmbCategory {
  title: string;
  icon: ReactElement | null;
  items: IXmbItem[];
  itemCount: number;
}

export class XmbItem implements IXmbItem {
  id: string;
  title: string;
  link?: string | null = '';
  type: string = '';
  icon: ReactElement | null;
  description?: string | null = '';
  shortDescription?: string = '';
  category?: string = '';
  shortCategory?: string = '';
  isActive: boolean = false;
  visible: boolean = true;
  modal?: string | null = '';
  items?: IXmbItem[] | null;
  parent?: XmbCategory | null;
  onClick?: (() => void) | null = null;

  constructor(id: string, title: string = '', icon: ReactElement | null = null, link?: string | null, description?: string | null) {
    this.id = id;
    this.title = title;
    this.icon = icon;
    this.link = link;
    this.description = description;
  }

  static create(id: string, title: string = '', icon: ReactElement | null, onClick: null | (() => void)): XmbItem
  {
    const item = new XmbItem(id, title, icon);
    item.onClick = onClick;
    return item;
  }

  static createModal(id: string, title: string = '', icon: ReactElement | null, modal: string | null): XmbItem
  {
    const item = new XmbItem(id, title, icon);
    item.modal = modal;
    return item;
  }

  static createSubmenu(id: string, title: string = '', icon: ReactElement | null, items?: XmbItem[] | null): XmbItem
  {
    const item = new XmbItem(id, title, icon);
    item.items = items;
    return item;
  }

  setActive() {
    this.isActive = true;
  }

  setInactive() {
    this.isActive = false;
  }
}

export class XmbCategory implements IXmbCategory {
  index: number;
  title: string;
  icon: ReactElement | null;
  items: XmbItem[];
  current: XmbItem | null = null;
  isActive: boolean = false;
  position: number = 0;
  itemCount: number = 0;

  constructor(index: number, title: string, icon: ReactElement | null, items: XmbItem[]) {
    this.index = index;
    this.title = title;
    this.icon = icon;
    this.items = items;
    this.itemCount = this.items.length;

    // ensure that the items all have a reference to this category
    this.items.forEach((item) => {
      item.parent = this;
    });
  }
}

export class XmbMenu implements IXmbMenu {
  [index: number]: XmbCategory;
  items: XmbCategory[];

  constructor(items: XmbCategory[]) {
    this.items = items;
  }

  getCategory(p: number | Position): IXmbCategory {
    if (typeof p === "number") {
      return this.items[p];
    }
    return this.items[p.x];
  }
}

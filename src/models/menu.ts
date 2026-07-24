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
  readonly [index: number]: IXmbCategory;
  getCategory(p: number | Position): IXmbCategory;
  getItem(p: number | Position): IXmbItem;
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
  readonly [index: number]: IXmbItem;
  [name: string]: unknown;

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
  private _position: Position = { x: 0, y: 0 };

  public get x(): number {
    return this._position.x;
  }

  public set x(value: number) {
    const nextCategory = this.items[value];
    this.setY(nextCategory.position);

    this._position.x = value;
  }

  public get y(): number {
    return this._position.y;
  }

  public set y(value: number) {
    if (value < 0) value = 0;
    const maxY = this.getCurrentCategory().items.length - 1;
    if (value >= maxY) value = maxY;
    this._position.y = value;
  }

  public get position(): Position {
    return this._position;
  }

  public set position(value: Position) {
    this.x = value.x;
    this.y = value.y;

    this._position = value;
  }

  constructor(items: XmbCategory[]) {
    this.items = items;
  }

  getCategory(p: number | Position): IXmbCategory {
    if (typeof p === "number") {
      return this.items[p];
    }
    return this.items[p.x];
  }

  getCurrentCategory(): XmbCategory {
    return this.items[this.position.x];
  }

  getItem(p: number | Position): IXmbItem {
    if (typeof p === "number") {
      return this.getCurrentCategory().items[p];
    }
    return this.items[p.x].items[p.y];
  }

  getCurrentItem(): XmbItem {
    return this.items[this.position.x].items[this.position.y];
  }

  getCurrentPosition(): Position {
    return this.position;
  }

  setX(x: number): Position {
    if (x < 0) throw new RangeError("Argument value cannot be negative");
    if (x >= this.items.length) throw new RangeError("Argument value greater than number of categories.");

    // no change
    if (x === this.x) return this._position;

    this.x = x;

    return this._position;
  }

  setY(y: number): Position {
    if (y < 0) throw new RangeError("Argument value cannot be negative");

    // no change
    if (y === this.y) return this._position;

    const currentCategory = this.getCurrentCategory();
    if (y >= currentCategory.items.length) y = currentCategory.items.length - 1;
    this.y = y;
    return this._position;
  }

  setPosition(x: number, y: number): Position {
    this.setX(x);
    this.setY(y);
    return this._position;
  }

  minX(): number {
    return 0;
  }

  minY(): number {
    return 0;
  }

  maxX(): number {
    return this.items.length - 1;
  }

  maxY(): number {
    return this.getCurrentCategory().items.length - 1;
  }

  moveUp(): Position | null {
    const nextY = this.y - 1;

    if (nextY <= 0) return null;

    this.y = nextY;

    return this.position;
  }

  moveTop(): Position | null {
    const nextY = 0;
    if (nextY == this.y) return null;

    this.y = nextY;

    return this.position;
  }

  moveDown(): Position | null {
    const current = this.getCurrentCategory();
    const maxY = current.items.length - 1;

    const nextY = this.y + 1;

    if (nextY >= maxY) return null;

    this.y = nextY;

    return this.position;
  }

  moveBottom(): Position | null {
    const current = this.getCurrentCategory();
    const maxY = current.items.length - 1;

    this.y = maxY;

    return this.position;
  }

  moveLeft(): Position | null{
    const nextIndex = this.x - 1;

    // can't move left, ignore
    if (nextIndex < 0) return null;

    this.x = nextIndex;

    return this.position;
  }

  moveFirst(): Position | null {
    if (this.x === 0) return null;
    this.x = 0;
    return this.position;
  }

  moveRight(): Position | null {
    const max = this.items.length - 1;
    const nextIndex = this.x + 1;

    // can't move right, ignore
    if (nextIndex > max) return null;

    this.x = nextIndex;

    return this.position;
  }

  moveLast(): Position | null {
    const max = this.items.length - 1;

    if (this.x === max) return null;

    const next = this.items[max];

    this.x = max;
    this.y = next.position;

    return this.position;
  }
}
